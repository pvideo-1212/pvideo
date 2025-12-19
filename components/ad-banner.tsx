'use client'

import { useEffect, useRef, useId } from 'react'

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
export function AdBanner({ zoneId, className = '' }: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const uniqueId = useId()
  const servedRef = useRef(false)

  useEffect(() => {
    if (servedRef.current) return

    // Wait for ad-provider script to be ready
    const serveAd = () => {
      if (typeof window !== 'undefined' && containerRef.current) {
        window.AdProvider = window.AdProvider || []
        window.AdProvider.push({ serve: {} })
        servedRef.current = true
      }
    }

    // Small delay to ensure the ins element is in DOM
    const timer = setTimeout(serveAd, 300)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      ref={containerRef}
      className={`ad-container ${className}`}
      id={`ad-${uniqueId}`}
    >
      {/* ExoClick Ad Slot - exactly matching their format */}
      <ins
        className="eas6a97888e2"
        data-zoneid={zoneId}
      />
    </div>
  )
}

// Banner with default zone ID
export function DefaultAd({ className }: { className?: string }) {
  return <AdBanner zoneId="5805148" className={className} />
}

// Native Ad component that injects via dangerouslySetInnerHTML
// Use this for more reliable ad rendering
export function NativeAdBanner({ zoneId = "5805148", className = '' }: { zoneId?: string, className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Clear any previous content
    containerRef.current.innerHTML = ''

    // Create ins element
    const ins = document.createElement('ins')
    ins.className = 'eas6a97888e2'
    ins.setAttribute('data-zoneid', zoneId)
    containerRef.current.appendChild(ins)

    // Create and execute script to serve ad
    const script = document.createElement('script')
    script.textContent = '(AdProvider = window.AdProvider || []).push({"serve": {}});'
    containerRef.current.appendChild(script)
  }, [zoneId])

  return (
    <div
      ref={containerRef}
      className={`ad-container ${className}`}
      style={{ minHeight: '90px' }}
    />
  )
}
