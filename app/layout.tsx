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
  metadataBase: new URL('https://pornhub1.fun'), // Base URL for relative links
  title: {
    default: 'TubeX - Premium Free HD Video Streaming',
    template: '%s - TubeX',
  },
  description: 'Watch millions of free HD videos on TubeX. No registration required. High quality, fast streaming, and daily updates.',
  keywords: ['videos', 'streaming', 'HD', '4K', 'free', 'adult', 'movies', 'clips'],
  authors: [{ name: 'TubeX' }],
  robots: 'index, follow',
  alternates: {
    canonical: './', // Auto-generates canonical URL for every page
  },
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
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://pornhub1.fun/?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
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
