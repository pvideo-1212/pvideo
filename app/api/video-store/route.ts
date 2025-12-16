import { NextRequest, NextResponse } from 'next/server'

// No Redis - this route is deprecated
// Video CDN URLs are fetched fresh via /api/scrape-video

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'This route is deprecated. Use /api/scrape-video instead.',
    note: 'CDN URLs are now fetched fresh each time due to short expiration.'
  })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    message: 'This route is deprecated. Use /api/scrape-video instead.'
  })
}
