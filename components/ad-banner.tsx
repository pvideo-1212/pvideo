'use client'

import { useEffect, useRef, useState } from 'react'

// MyBid.io Banner Component
// MyBid banners require script injection to display properly
export function MyBidBanner({ bannerId, className = '' }: { bannerId: string, className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    setMounted(true)
    setError(false)

    // MyBid banners need script injection after mount
    if (containerRef.current && typeof window !== 'undefined') {
      // Clear any existing content
      containerRef.current.innerHTML = ''

      // Create the ad container div
      const adDiv = document.createElement('div')
      adDiv.id = bannerId
      adDiv.setAttribute('data-banner-id', bannerId)
      containerRef.current.appendChild(adDiv)

      // Create and inject the MyBid script for this specific banner
      const script = document.createElement('script')
      script.async = true
      script.src = `https://js.mbidadm.com/banners/${bannerId}.js`
      script.onerror = () => {
        console.warn(`[MyBid] Banner ${bannerId} script failed to load (possibly invalid ID or blocker)`)
        setError(true)
      }
      containerRef.current.appendChild(script)
    }

    return () => {
      // Cleanup on unmount
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [bannerId])

  // Server-side placeholder
  if (!mounted) {
    return (
      <div className={`mybid-banner bg-[#2a2a2a] flex items-center justify-center ${className}`} style={{ minHeight: '90px' }}>
        <span className="text-gray-600 text-xs">Ad Placeholder</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`mybid-banner bg-[#2a2a2a] border border-red-500/20 flex flex-col items-center justify-center p-4 ${className}`} style={{ minHeight: '90px' }}>
        <span className="text-red-400/50 text-xs font-mono mb-1">Ad Loading Failed</span>
        <span className="text-gray-600 text-[10px] font-mono">ID: {bannerId} (404/Blocked)</span>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`mybid-banner ${className}`}
      style={{ minHeight: '90px' }}
    />
  )
}

// Alternative: Direct iframe embed for MyBid banners
export function MyBidIframeBanner({ bannerId, className = '' }: { bannerId: string, className?: string }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={`mybid-banner bg-[#2a2a2a] flex items-center justify-center ${className}`} style={{ minHeight: '90px' }}>
        <span className="text-gray-600 text-xs">Ad Placeholder</span>
      </div>
    )
  }

  return (
    <div className={`mybid-banner ${className}`}>
      <iframe
        src={`https://js.mbidadm.com/p/${bannerId}`}
        width="100%"
        height="90"
        frameBorder="0"
        scrolling="no"
        style={{ overflow: 'hidden', minHeight: '90px', border: 'none' }}
        allow="autoplay"
        title={`Ad Banner ${bannerId}`}
      />
    </div>
  )
}

// In-Content Ad Banner - for placing between video rows
export function InContentAd({ className = '' }: { className?: string }) {
  return (
    <div className={`my-4 sm:my-6 rounded-xl overflow-hidden bg-[#1a1a1a] border border-[#2a2a2a] p-2 sm:p-4 ${className}`}>
      <MyBidIframeBanner bannerId="2015213" className="w-full min-h-[90px]" />
    </div>
  )
}

// Sidebar Ad Banner - for sidebars
export function SidebarAd({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-lg overflow-hidden bg-[#252525] min-h-[90px] ${className}`}>
      <MyBidIframeBanner bannerId="2015214" className="w-full" />
    </div>
  )
}

// Footer Ad Banner - for above footer
export function FooterAd({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full py-4 px-4 bg-[#0d0d0d] border-t border-[#1f1f1f] ${className}`}>
      <div className="max-w-[1600px] mx-auto">
        <MyBidIframeBanner bannerId="2015213" className="w-full min-h-[90px]" />
      </div>
    </div>
  )
}

// Leaderboard Ad - for top of pages
export function LeaderboardAd({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full py-3 px-4 bg-[#0d0d0d] ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="rounded-xl overflow-hidden bg-[#1a1a1a] border border-[#2a2a2a] p-2">
          <MyBidIframeBanner bannerId="2015214" className="w-full min-h-[90px]" />
        </div>
      </div>
    </div>
  )
}
