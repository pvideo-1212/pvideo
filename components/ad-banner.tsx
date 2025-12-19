'use client'

import { useEffect, useRef, useState } from 'react'

interface AdBannerProps {
  zoneId: string
  className?: string
}

// Declare global AdProvider type
declare global {
  interface Window {
    AdProvider: Array<{ serve: Record<string, unknown> }>
  }
}

// ExoClick/Magsrv Ad Banner Component
// This component only renders on client to avoid hydration mismatch
export function AdBanner({ zoneId, className = '' }: AdBannerProps) {
  const [mounted, setMounted] = useState(false)
  const servedRef = useRef(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || servedRef.current) return

    // Wait for ad-provider script to be ready, then serve
    const serveAd = () => {
      if (typeof window !== 'undefined') {
        window.AdProvider = window.AdProvider || []
        window.AdProvider.push({ serve: {} })
        servedRef.current = true
      }
    }

    // Small delay to ensure the ins element is in DOM
    const timer = setTimeout(serveAd, 300)

    return () => clearTimeout(timer)
  }, [mounted])

  // Don't render on server to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className={`ad-container ${className}`} style={{ minHeight: '90px' }}>
        {/* Placeholder during SSR */}
      </div>
    )
  }

  return (
    <div className={`ad-container ${className}`}>
      <ins
        className="eas6a97888e2"
        data-zoneid={zoneId}
      />
    </div>
  )
}

// Alias for backwards compatibility
export function NativeAdBanner({ zoneId = "5805148", className = '' }: { zoneId?: string, className?: string }) {
  return <AdBanner zoneId={zoneId} className={className} />
}

// Banner with default zone ID
export function DefaultAd({ className }: { className?: string }) {
  return <AdBanner zoneId="5805148" className={className} />
}
