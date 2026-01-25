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
    default: 'TubeX - Premium Free HD Video Streaming',
    template: '%s | TubeX',
  },
  description: 'Watch millions of free HD videos on TubeX. No registration required. High quality, fast streaming, and daily updates. Browse categories, models, and channels.',
  keywords: [
    'free videos', 'HD streaming', '4K videos', 'online videos', 'watch free',
    'video platform', 'daily updates', 'streaming site', 'video streaming',
    'adult entertainment', 'free streaming', 'HD quality', 'video categories',
    'pornstars', 'models', 'channels', 'studios', 'amateur videos', 'professional videos'
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
    siteName: 'TubeX',
    title: 'TubeX - Premium Free HD Video Streaming',
    description: 'Watch millions of free HD videos. No registration required. High quality, fast streaming.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TubeX - Premium Video Streaming',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TubeX - Premium Free HD Video Streaming',
    description: 'Watch millions of free HD videos. No registration, fast streaming.',
    images: ['/og-image.png'],
    creator: '@tubex',
  },
  verification: {
    google: 'your-google-verification-code', // Add your verification code
  },
  category: 'entertainment',
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
