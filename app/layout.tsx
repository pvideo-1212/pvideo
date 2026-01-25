import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'
import Footer from '@/components/Footer'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://pornhub1.fun'),
  title: {
    default: 'Free HD Porn Videos - Pornhub1 | Premium Adult Streaming',
    template: '%s | Pornhub1 - Free HD Porn',
  },
  description: 'Watch millions of free HD porn videos on Pornhub1. No registration required. Stream full-length amateur and professional sex clips with no ads. High quality, fast streaming.',
  keywords: [
    'free hd porn', 'amateur couples', 'professional porn', 'full length sex movies',
    'vr porn', '4k adult videos', 'mobile porn', 'hot sex clips',
    'premium adult streaming', 'no registration porn', 'fast streaming porn',
    'uncensored videos', 'exclusive amateur', 'reality porn', 'step fantasy',
    'milf videos', 'lesbian sex', 'anal porn', 'blowjob videos', 'cumshot compilation'
  ],
  authors: [{ name: 'TubeX Team' }],
  creator: 'TubeX',
  publisher: 'TubeX',
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
  alternates: {
    canonical: './',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://pornhub1.fun',
    siteName: 'Pornhub1',
    title: 'Free HD Porn Videos - Pornhub1 | Premium Adult Streaming',
    description: 'Watch millions of free HD porn videos on Pornhub1. No registration required. Stream full-length amateur and professional sex clips.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Pornhub1 - Premium Free HD Porn',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free HD Porn Videos - Pornhub1',
    description: 'Watch millions of free HD porn videos. No registration, fast streaming.',
    images: ['/og-image.png'],
    creator: '@tubex',
  },
  verification: {
    google: 'your-google-verification-code', // Add your verification code
  },
  category: 'adult entertainment',
}

export const viewport = {
  themeColor: '#9333ea',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // WebSite Schema for Brand Signal
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'TubeX',
    url: 'https://pornhub1.fun',
    description: 'Premium free HD video streaming platform',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://pornhub1.fun/?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }

  // Organization Schema for Brand Recognition
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TubeX',
    url: 'https://pornhub1.fun',
    logo: 'https://pornhub1.fun/icon1.png',
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      availableLanguage: ['English']
    }
  }

  // Combined schemas
  const schemas = [websiteSchema, organizationSchema]

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
        />
        {/* MyBid.io Ad Network */}
        <Script
          async
          src="https://js.mbidadm.com/static/scripts.js"
          data-admpid="417879"
          strategy="afterInteractive"
        />
        <Script id="mybid-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              navigator.serviceWorker.register('/sw.js').then(function(registration) {
                console.log('MyBid SW registered:', registration.scope);
              }).catch(function(err) {
                console.log('MyBid SW failed:', err);
              });
            }
          `}
        </Script>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="font-sans antialiased min-h-screen bg-[#0a0a0a] text-white flex flex-col" suppressHydrationWarning>
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  )
}
