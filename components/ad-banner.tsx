'use client'

import { useEffect, useState } from 'react'

// MyBid.io Banner Component
// Uses the global script injected in layout.tsx to populate divs with data-banner-id
export function MyBidBanner({ bannerId, className = '' }: { bannerId: string, className?: string }) {
  return (
    <div className={`mybid-banner-container ${className} flex justify-center items-center overflow-hidden`}>
      <div data-banner-id={bannerId} style={{ display: 'block' }}></div>
    </div>
  )
}

// Keeping the Iframe version just in case, but unused for now
export function MyBidIframeBanner({ bannerId, className = '' }: { bannerId: string, className?: string }) {
  return <MyBidBanner bannerId={bannerId} className={className} />
}

// In-Content Ad Banner - for placing between video rows
export function InContentAd({ className = '' }: { className?: string }) {
  return (
    <div className={`my-4 sm:my-6 rounded-xl overflow-hidden bg-[#1a1a1a] border border-[#2a2a2a] p-2 sm:p-4 ${className}`}>
      {/* Used ID: 2015213 */}
      <MyBidBanner bannerId="2015213" className="w-full min-h-[90px]" />
    </div>
  )
}

// Sidebar Ad Banner - for sidebars
export function SidebarAd({ className = '' }: { className?: string }) {
  return (
    <div className={`rounded-lg overflow-hidden bg-[#252525] min-h-[90px] ${className}`}>
      {/* Used ID: 2015359 (From user list) */}
      <MyBidBanner bannerId="2015359" className="w-full" />
    </div>
  )
}

// Footer Ad Banner - for above footer
export function FooterAd({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full py-4 px-4 bg-[#0d0d0d] border-t border-[#1f1f1f] ${className}`}>
      <div className="max-w-[1600px] mx-auto flex justify-center">
        {/* Used ID: 2015360 (From user list) */}
        <MyBidBanner bannerId="2015360" className="w-full min-h-[90px]" />
      </div>
    </div>
  )
}

// Leaderboard Ad - for top of pages
export function LeaderboardAd({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full py-3 px-4 bg-[#0d0d0d] ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="rounded-xl overflow-hidden bg-[#1a1a1a] border border-[#2a2a2a] p-2 flex justify-center">
          {/* Used ID: 2015214 */}
          <MyBidBanner bannerId="2015214" className="w-full min-h-[90px]" />
        </div>
      </div>
    </div>
  )
}
