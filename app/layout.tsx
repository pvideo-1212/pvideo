import type React from "react"
import type { Metadata } from "next"
import Script from "next/script"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/components/auth-context"
import { ThemeProvider } from "@/components/theme-provider"
import { AgeVerificationDialog } from "@/components/age-verification-dialog"
import AnalyticsProvider from "@/components/analytics-provider"
import { getAllKeywords } from "@/lib/seo-keywords"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

// Get all 10,000+ keywords
let allKeywords = getAllKeywords()
let arr = ["4tube", "alohatub",
  "amaturetube",
  "beautiful sex tube",
  "black sex tube",
  "blacked sex tube",
  "free black sex video",
  "grandma sex tube",
  "guysformatures"];

export const metadata: Metadata = {
  title: "4tube - Free Porn Videos & Sex Movies",
  description: "Watch free porn videos at 4tube, the world's leading free porn site. Choose from millions of hardcore videos that stream quickly and in high quality, including amazing HD porn. The largest amateur porn community on the net as well as full-length scenes from the top studios.",
  keywords: [...allKeywords, ...arr],
  authors: [{ name: "4tube" }],
  creator: "4tube",
  publisher: "4tube",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pornhub1.fun",
    siteName: "Pornhub",
    title: "Pornhub - Free Porn Videos & Sex Movies",
    description: "Watch free porn videos at Pornhub. The world's leading free porn site with millions of HD videos. Stream or download in full HD quality.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pornhub - Free Porn Videos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pornhub - Free Porn Videos & Sex Movies",
    description: "Watch free porn videos at Pornhub. The world's leading free porn site with millions of HD videos.",
    site: "@pornhub",
    creator: "@pornhub",
  },
  verification: {
    google: "google-site-verification-token",
  },
  alternates: {
    canonical: "https://pornhub1.fun",
    languages: {
      'en-US': 'https://pornhub1.fun',
      'es-ES': 'https://es.pornhub1.fun',
      'de-DE': 'https://de.pornhub1.fun',
      'fr-FR': 'https://fr.pornhub1.fun',
      'it-IT': 'https://it.pornhub1.fun',
      'pt-PT': 'https://pt.pornhub1.fun',
      'ru-RU': 'https://ru.pornhub1.fun',
      'ja-JP': 'https://jp.pornhub1.fun',
      'ko-KR': 'https://kr.pornhub1.fun',
      'zh-CN': 'https://cn.pornhub1.fun',
    },
  },
  category: "adult",
  other: {
    'rating': 'adult',
    'RATING': 'RTA-5042-1996-1400-1577-RTA',
    'content-language': 'en-US',
    'distribution': 'global',
    'revisit-after': '1 day',
    'audience': 'adult',
  },
}

// JSON-LD Structured Data
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Pornhub",
  "url": "https://pornhub1.fun",
  "description": "The world's leading free porn site with millions of HD videos.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://pornhub1.fun/?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Pornhub",
  "url": "https://pornhub1.fun",
  "logo": "https://pornhub1.fun/logo.png",
  "sameAs": [
    "https://twitter.com/pornhub",
    "https://instagram.com/pornhub",
    "https://youtube.com/pornhub"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "email": "support@pornhub1.fun"
  }
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://pornhub1.fun"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Categories",
      "item": "https://pornhub1.fun/categories"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Pornstars",
      "item": "https://pornhub1.fun/pornstars"
    }
  ]
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data */}
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <meta name="6a97888e-site-verification" content="6535a62ed6135144c8b231bf87e7b548"></meta>
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Script
          id="breadcrumb-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WPKW6YQD4F"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments)}
            gtag('js', new Date());
            gtag('config', 'G-WPKW6YQD4F');
          `}
        </Script>

        {/* Additional SEO Meta Tags */}
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
        <meta name="DC.title" content="Pornhub - Free Porn Videos" />
        <meta name="DC.creator" content="Pornhub" />
        <meta name="DC.subject" content="Adult Entertainment" />
        <meta name="DC.description" content="Free porn videos streaming site" />
        <meta name="DC.language" content="en" />

        {/* Mobile Web App */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Pornhub" />

        {/* Theme Color */}
        <meta name="theme-color" content="#FF9000" />
        <meta name="msapplication-TileColor" content="#FF9000" />
        <meta name="msapplication-navbutton-color" content="#FF9000" />

        {/* Preconnect to CDNs */}
        <link rel="preconnect" href="https://cdn.pornhub.com" />
        <link rel="dns-prefetch" href="https://cdn.pornhub.com" />

        {/* ExoClick/Magsrv Ads - Delegate CH */}
        <script async type="application/javascript" src="https://a.magsrv.com/ad-provider.js"></script>
        <ins className="eas6a97888e2" data-zoneid="5805148"></ins>
        <script dangerouslySetInnerHTML={{ __html: '(AdProvider = window.AdProvider || []).push({"serve": {}});' }} />
      </head>
      <body className={`font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <AnalyticsProvider>
              <AgeVerificationDialog />
              {children}
            </AnalyticsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
