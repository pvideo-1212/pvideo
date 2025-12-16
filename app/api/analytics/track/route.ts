import { NextRequest, NextResponse } from "next/server"
import { trackVisitor } from "@/app/actions/analytics"

// Track visitor on each page view
export async function POST(req: NextRequest) {
  try {
    // Get IP from headers
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown'

    await trackVisitor(ip)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Analytics] Track error:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
