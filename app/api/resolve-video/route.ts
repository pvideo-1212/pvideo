import { NextRequest, NextResponse } from 'next/server'
import { createLogger, generateRequestId } from '@/lib/scrape-logger'

// No Redis - just redirect to scrape-video API
// This route is deprecated, use /api/scrape-video instead

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  const quality = searchParams.get('quality')

  if (!url) {
    return NextResponse.json({ error: 'url required' }, { status: 400 })
  }

  // Redirect to scrape-video
  const scrapeUrl = new URL('/api/scrape-video', request.url)
  scrapeUrl.searchParams.set('url', url)
  if (quality) scrapeUrl.searchParams.set('quality', quality)

  return NextResponse.redirect(scrapeUrl.toString())
}

export async function POST(request: NextRequest) {
  const { pageUrl, quality } = await request.json()

  if (!pageUrl) {
    return NextResponse.json({ error: 'pageUrl required' }, { status: 400 })
  }

  // Forward to scrape-video
  const response = await fetch(new URL('/api/scrape-video', request.url).toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pageUrl, quality })
  })

  return response
}
