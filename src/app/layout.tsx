import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GATracking } from "@/components/analytics/ga-tracking";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BudgetCasa Pro - Piattaforma per Agenti Assicurativi",
  description: "Scopri e gestisci lead, consulta analytics di rischio e ottieni suggerimenti AI per polizze assicurative.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GATracking measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
        {children}
      </body>
    </html>
  );
}
