import { NextResponse } from "next/server"
import { getAnalyticsStats } from "@/app/actions/analytics"

// Get analytics stats for admin dashboard
export async function GET() {
  try {
    const stats = await getAnalyticsStats()

    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('[Analytics] Stats error:', error)
    return NextResponse.json({
      success: false,
      data: {
        realtime: 0,
        utils: [],
        daily: 0,
        total: 0,
        pageViews: 0
      }
    })
  }
}
