"use client"

import React, { Suspense } from "react"
import { useAnalytics } from "@/hooks/use-analytics"

function AnalyticsTracker() {
  useAnalytics()
  return null
}

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
    </>
  )
}
