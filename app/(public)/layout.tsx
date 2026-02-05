import Navbar from "@/components/web/navbar/navbar";
import type { Metadata, Viewport } from "next";
import { ReactNode } from "react";

import Footer from "./_components/Footer";

const siteUrl = "https://spend-ix.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Spendix — AI-Powered Financial Management",
    template: "%s | Spendix",
  },
  description:
    "Track your finances with AI-powered insights, proactive alerts, and beautiful analytics dashboards.",
  keywords: [
    "AI budgeting platform",
    "financial analytics",
    "spending tracker",
    "budget automation",
    "Spendix",
    "AI powered personalised finance assistant chatbot",
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Spendix — AI-Powered Financial Management",
    description:
      "Smart budget tracking, real-time analytics, and intelligent alerts for modern finance teams.",
    siteName: "Spendix",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Spendix dashboard preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Spendix — AI-Powered Financial Management",
    description:
      "Smart budget tracking, real-time analytics, and intelligent alerts for modern finance teams.",
    creator: "@spendix",
    images: [`${siteUrl}/og-image.png`],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Spendix",
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  sameAs: [
    "https://twitter.com/spendix",
    "https://www.linkedin.com/company/spendix",
    "https://github.com/spendix",
  ],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Spendix",
  url: siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([organizationSchema, websiteSchema]),
        }}
      />
      <header
        aria-label="Primary"
        className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-white/5 backdrop-blur-xl border-b border-border shadow-md"
      >
        <Navbar />
      </header>
      <main className="relative flex w-full flex-col items-center justify-start overflow-hidden bg-transparent">
        {children}
      </main>
      <Footer />
    </>
  );
}
