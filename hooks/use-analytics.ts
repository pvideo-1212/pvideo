
"use client"

import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function useAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const trackedRef = useRef<string | null>(null)

  useEffect(() => {
    const track = async () => {
      // Create a unique key for this page view (path + params)
      // Actually for visitor tracking we just want to heartbeat
      // But let's track on route change to keep "last seen" fresh

      const currentPath = pathname + searchParams.toString()
      // Debounce/prevent double tracking for same render cycle if needed, 
      // but Effect runs on dependency change.

      try {
        await fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        })
      } catch (err) {
        // Silent fail
      }
    }

    // Track on mount and on route change
    // Using a timeout to ensure we don't spam if rapid navigation
    const timeoutId = setTimeout(track, 1000)

    return () => clearTimeout(timeoutId)
  }, [pathname, searchParams])
}
