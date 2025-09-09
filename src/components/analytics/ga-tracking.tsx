'use client'

import Script from 'next/script'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface GATrackingProps {
  measurementId: string
}

export function GATracking({ measurementId }: GATrackingProps) {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', measurementId, {
        page_path: pathname,
      })
    }
  }, [pathname, measurementId])

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  )
}

// Enhanced event tracking functions
export const trackProEvent = {
  searchPerson: (params: {
    q?: string
    city?: string
    has_children?: boolean
    min_income?: number
    results: number
  }) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'pro_search_person', {
        search_term: params.q,
        city: params.city,
        has_children: params.has_children,
        min_income: params.min_income,
        results: params.results,
        event_category: 'pro_engagement',
        event_label: 'person_search'
      })
    }
  },

  searchCompany: (params: {
    q?: string
    city?: string
    ateco?: string
    min_employees?: number
    results: number
  }) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'pro_search_company', {
        search_term: params.q,
        city: params.city,
        ateco: params.ateco,
        min_employees: params.min_employees,
        results: params.results,
        event_category: 'pro_engagement',
        event_label: 'company_search'
      })
    }
  },

  viewLead: (params: { type: 'person' | 'company', id: string }) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'pro_view_lead', {
        lead_type: params.type,
        lead_id: params.id,
        event_category: 'pro_engagement',
        event_label: 'view_lead_detail'
      })
    }
  },

  addToList: (params: { list_id: string, entity_type: 'person' | 'company' }) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'pro_add_to_list', {
        list_id: params.list_id,
        entity_type: params.entity_type,
        event_category: 'pro_conversion',
        event_label: 'add_to_list'
      })
    }
  },

  exportCSV: (params: { list_id: string, size: number }) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'pro_export_csv', {
        list_id: params.list_id,
        list_size: params.size,
        event_category: 'pro_conversion',
        event_label: 'export_csv',
        value: params.size // Number of leads exported
      })
    }
  },

  viewSuggestions: (params: { entity_type: 'person' | 'company', entity_id: string, suggestions_count: number }) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'pro_view_suggestions', {
        entity_type: params.entity_type,
        entity_id: params.entity_id,
        suggestions_count: params.suggestions_count,
        event_category: 'pro_engagement',
        event_label: 'ai_suggestions'
      })
    }
  },

  createList: (params: { type: 'person' | 'company', name: string }) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'pro_create_list', {
        list_type: params.type,
        list_name: params.name,
        event_category: 'pro_engagement',
        event_label: 'create_list'
      })
    }
  }
}