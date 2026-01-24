'use client'

import { useEffect, useState } from 'react'

// MyBid.io Banner Component
// Uses id attribute to mount banner - MyBid script looks for elements by id
export function MyBidBanner({ bannerId, className = '' }: { bannerId: string, className?: string }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render on server to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className={`mybid-banner ${className}`} style={{ minHeight: '90px' }}>
        {/* Placeholder during SSR */}
      </div>
    )
  }

  return (
    <div className={`mybid-banner ${className}`}>
      <div id={bannerId} data-banner-id={bannerId} />
    </div>
  )
}

// In-Content Ad Banner - for placing between video rows
export function InContentAd({ className = '' }: { className?: string }) {
  return (
    <div className={`my-4 sm:my-6 rounded-xl overflow-hidden bg-[#1a1a1a] border border-[#2a2a2a] p-2 sm:p-4 ${className}`}>
      <MyBidBanner bannerId="2015213" className="w-full min-h-[90px]" />
    </div>
  )
}

// Sidebar Ad Banner - for sidebars
export function SidebarAd({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-lg overflow-hidden bg-[#252525] min-h-[90px] ${className}`}>
      <MyBidBanner bannerId="2015214" className="w-full" />
    </div>
  )
}

// Footer Ad Banner - for above footer
export function FooterAd({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full py-4 px-4 bg-[#0d0d0d] border-t border-[#1f1f1f] ${className}`}>
      <div className="max-w-[1600px] mx-auto">
        <MyBidBanner bannerId="2015213" className="w-full min-h-[90px]" />
      </div>
    </div>
  )
}

// Leaderboard Ad - for top of pages
export function LeaderboardAd({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full py-3 px-4 bg-[#0d0d0d] ${className}`}>
      <div className="max-w-[1600px] mx-auto">
        <div className="rounded-xl overflow-hidden bg-[#1a1a1a] border border-[#2a2a2a] p-2">
          <MyBidBanner bannerId="2015214" className="w-full min-h-[90px]" />
        </div>
      </div>
    </div>
  )
}
