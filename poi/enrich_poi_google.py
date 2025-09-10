#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os, json, time, math, re, argparse, sys
from urllib.parse import urlencode
from urllib.request import urlopen
from urllib.error import URLError, HTTPError
from datetime import datetime, timezone
from time import monotonic

PLACES_BASE = "https://maps.googleapis.com/maps/api/place"
API_KEY = os.environ.get("GOOGLE_API_KEY")

# ---- Utils -------------------------------------------------
def http_get(url, params, timeout=15):
    q = urlencode(params)
    with urlopen(f"{url}?{q}", timeout=timeout) as r:
        return json.loads(r.read().decode("utf-8"))

def haversine(lat1, lon1, lat2, lon2):
    R = 6371000.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlmb = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(p1)*math.cos(p2)*math.sin(dlmb/2)**2
    return 2 * R * math.atan2(math.sqrt(a), math.sqrt(1 - a))

def token_sim(a, b):
    sa = set(re.findall(r"[a-z0-9]+", (a or "").lower()))
    sb = set(re.findall(r"[a-z0-9]+", (b or "").lower()))
    if not sa or not sb: return 0.0
    inter = len(sa & sb)
    denom = (len(sa) + len(sb)) / 2.0
    return inter / denom

def best_snippet(reviews):
    if not reviews: return ""
    cand = sorted(
        reviews,
        key=lambda r: (r.get("rating", 0), len((r.get("text") or ""))),
        reverse=True
    )[0]
    txt = re.sub(r"\s+", " ", (cand.get("text") or "").strip())
    return (txt[:197] + "…") if len(txt) > 200 else txt

def now_iso_utc():
    return datetime.now(timezone.utc).isoformat()

TYPE_MAP = {
    "bakery": "bakery",
    "cafe": "cafe",
    "restaurant": "restaurant",
    "park": "park",
    "school": "school",
    "hospital": "hospital",
    "gym": "gym",
    "coworking": None,  # -> keyword
    "culture": None,    # -> keyword
    "shopping": "shopping_mall",
}

CATEGORY_EXTRA = {
    "culture":   " museo galleria arte teatro biblioteca cinema",
    "coworking": " coworking spazio studio hub",
}

# ---- Google Places wrappers --------------------------------
def nearby_search(lat, lon, name, category, radius, key):
    kw = (name or "").strip() + CATEGORY_EXTRA.get(category, "")
    params = {
        "location": f"{lat},{lon}",
        "radius": radius,
        "language": "it",
        "region": "it",
        "key": key,
        "keyword": kw.strip()
    }
    gtype = TYPE_MAP.get(category)
    if gtype:
        params["type"] = gtype
    return http_get(f"{PLACES_BASE}/nearbysearch/json", params)

def text_search(query, key):
    return http_get(
        f"{PLACES_BASE}/textsearch/json",
        {"query": query, "language": "it", "region": "it", "key": key}
    )

def place_details(place_id, key):
    fields = "rating,user_ratings_total,reviews"
    return http_get(
        f"{PLACES_BASE}/details/json",
        {"place_id": place_id, "fields": fields, "language": "it", "key": key}
    )

# ---- Matching / scoring ------------------------------------
def score_candidate(poi, res):
    gloc = res.get("geometry", {}).get("location", {})
    if not gloc: return 0.0, None
    dist = haversine(poi["lat"], poi["lon"], gloc.get("lat", 0), gloc.get("lng", 0))
    name_sim = token_sim(poi.get("name", ""), res.get("name", ""))
    score = 0.0
    if dist <= 200:
        score += 0.6
        if dist <= 100:
            score += 0.1
    if name_sim >= 0.75:
        score += 0.3
        if name_sim >= 0.85:
            score += 0.1
    return min(score, 1.0), dist

def confidence(dist, sim):
    if dist is None: return "low"
    if dist <= 100 and sim >= 0.80: return "high"
    if dist <= 200 or sim >= 0.75: return "medium"
    return "low"

# ---- Main ---------------------------------------------------
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--input",  default="poi_milano.jsonl")
    ap.add_argument("--out",    default="poi_milano_enriched.jsonl")
    ap.add_argument("--report", default="report_quality_v2.json")
    ap.add_argument("--radius", type=int, default=150)
    ap.add_argument("--qps",    type=float, default=3.0)
    ap.add_argument("--sample", type=int, default=0, help="elabora solo i primi N POI")
    ap.add_argument("--poi-timeout", type=int, default=45, help="timeout (s) per singolo POI")
    args = ap.parse_args()

    if not API_KEY:
        print("ERROR: set GOOGLE_API_KEY env var", file=sys.stderr)
        sys.exit(1)

    pois = [json.loads(l) for l in open(args.input, encoding="utf-8")]
    if args.sample:
        pois = pois[:args.sample]

    # ---- Resume: salta i POI già presenti nell'output
    already = set()
    try:
        with open(args.out, encoding="utf-8") as g:
            for L in g:
                try:
                    already.add(json.loads(L)["poi_id"])
                except:
                    pass
    except FileNotFoundError:
        pass

    out = open(args.out, "a", encoding="utf-8")  # append per riprendere
    sleep_s = 1.0 / max(args.qps, 0.5)

    # metriche
    have_rating = 0
    have_reviews = 0
    cat_cov = {}
    api_errors = 0
    poi_zero_results = 0
    used_text_count = 0

    cache_nearby, cache_text, cache_details = {}, {}, {}

    start = monotonic()
    total = len(pois)
    processed = 0

    for idx, rec in enumerate(pois, 1):
        if rec.get("poi_id") in already:
            processed += 1
            continue

        cat = rec.get("category", "unknown")
        cat_cov.setdefault(cat, {"n": 0, "rated": 0})
        cat_cov[cat]["n"] += 1

        place_id = None
        best = None
        best_score = 0.0
        best_dist = None

        poi_start = monotonic()
        had_any_ok = False
        used_text = False

        # --- Nearby Search
        try:
            nkey = (round(rec["lat"], 6), round(rec["lon"], 6), rec.get("name", ""), cat)
            nres = cache_nearby.get(nkey)
            if nres is None:
                nres = nearby_search(rec["lat"], rec["lon"], rec.get("name",""), cat, args.radius, API_KEY)
                cache_nearby[nkey] = nres
                time.sleep(sleep_s)

            if nres.get("status") == "OK":
                had_any_ok = True
                for cand in nres.get("results", []):
                    sc, dist = score_candidate(rec, cand)
                    if sc > best_score:
                        best_score, best, best_dist = sc, cand, dist
        except (URLError, HTTPError, TimeoutError, ValueError):
            api_errors += 1

        # --- Fallback: Text Search
        if best_score < 0.5 and (monotonic() - poi_start) <= args.poi_timeout:
            try:
                q = f'{rec.get("name","")}, {rec.get("address_full","")}, {rec.get("city","Milano")}'
                tres = cache_text.get(q)
                if tres is None:
                    tres = text_search(q, API_KEY)
                    cache_text[q] = tres
                    time.sleep(sleep_s)
                if tres.get("status") == "OK":
                    had_any_ok = True
                    used_text = True
                    for cand in tres.get("results", []):
                        sc, dist = score_candidate(rec, cand)
                        if sc > best_score:
                            best_score, best, best_dist = sc, cand, dist
            except (URLError, HTTPError, TimeoutError, ValueError):
                api_errors += 1

        if used_text:
            used_text_count += 1

        # --- Watchdog anti-stallo
        if monotonic() - poi_start > args.poi_timeout:
            # Scrivi record "vuoto" ma coerente e passa oltre
            rec["rating"] = None
            rec["reviews_count"] = None
            rec["top_review_snippet"] = ""
            rec["rating_confidence"] = "low"
            rec["last_verified_utc"] = now_iso_utc()
            out.write(json.dumps(rec, ensure_ascii=False) + "\n")
            processed += 1
            # stampa progresso/ETA
            if processed % 100 == 0 or processed == total:
                elapsed = monotonic() - start
                pps = processed / max(elapsed, 1e-6)
                remaining = total - processed
                eta = remaining / max(pps, 1e-6)
                print(f"[{processed}/{total}] ok | {pps:.2f} POI/s | ETA ~ {int(eta/60)}m {int(eta%60)}s")
            continue

        # se nessun risultato da Nearby né Text → zero_results per-POI
        if not had_any_ok:
            poi_zero_results += 1

        # --- Place Details
        rating = None
        reviews_total = None
        snippet = ""
        conf = "low"

        if best:
            place_id = best.get("place_id")
            try:
                det = cache_details.get(place_id)
                if det is None:
                    det = place_details(place_id, API_KEY)
                    cache_details[place_id] = det
                    time.sleep(sleep_s)
                if det.get("status") == "OK":
                    r = det.get("result", {})
                    rating = r.get("rating")
                    reviews_total = r.get("user_ratings_total")
                    snippet = best_snippet(r.get("reviews") or [])
                    sim = token_sim(rec.get("name",""), best.get("name",""))
                    conf = confidence(best_dist, sim)
                    if conf in ("high", "medium"):
                        rec["source"] = "google_places"
                        rec["source_id"] = place_id
            except (URLError, HTTPError, TimeoutError, ValueError):
                api_errors += 1

        # --- Scrittura record arricchito
        rec["rating"] = rating
        rec["reviews_count"] = reviews_total
        rec["top_review_snippet"] = snippet
        rec["rating_confidence"] = conf
        rec["last_verified_utc"] = now_iso_utc()

        if rating is not None:
            have_rating += 1
            cat_cov[cat]["rated"] += 1
        if reviews_total:
            have_reviews += 1

        out.write(json.dumps(rec, ensure_ascii=False) + "\n")
        processed += 1

        # progresso/ETA
        if processed % 100 == 0 or processed == total:
            elapsed = monotonic() - start
            pps = processed / max(elapsed, 1e-6)
            remaining = total - processed
            eta = remaining / max(pps, 1e-6)
            print(f"[{processed}/{total}] ok | {pps:.2f} POI/s | ETA ~ {int(eta/60)}m {int(eta%60)}s")

    out.close()

    report = {
        "total_poi": total,
        "with_rating_percentage": round(have_rating / max(total, 1), 4),
        "with_reviews_percentage": round(have_reviews / max(total, 1), 4),
        "coverage_by_category": {
            k: round(v["rated"] / max(v["n"], 1), 4) for k, v in cat_cov.items()
        },
        "api_errors": api_errors,
        "zero_results": poi_zero_results,
        "used_text_fallback": used_text_count
    }
    with open(args.report, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    print("Done.\nReport:", json.dumps(report, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()
