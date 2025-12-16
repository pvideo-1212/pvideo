import { NextResponse } from "next/server"

// No Redis - return empty stats
export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      activeNow: 0,
      todayTotal: 0,
      uniqueIPs: 0,
      pageViews: 0,
    }
  })
}
