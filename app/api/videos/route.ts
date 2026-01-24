// GET /api/videos - Paginated video list

import { NextRequest, NextResponse } from 'next/server'
import { scrapeVideoListFast } from '@/lib/scraper/scrape-fast'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1', 10)

    console.log('[API /api/videos] Requested page:', page)

    if (page < 1 || page > 100) {
      return NextResponse.json(
        { success: false, error: 'Page must be between 1 and 100' },
        { status: 400 }
      )
    }

    const result = await scrapeVideoListFast(page)
    console.log('[API /api/videos] Got', result.items.length, 'items for page', page)

    return NextResponse.json({
      success: true,
      ...result,
    })

  } catch (error) {
    console.error('[API] /api/videos error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch videos' },
      { status: 500 }
    )
  }
}

// Force dynamic rendering for searchParams
export const dynamic = 'force-dynamic'
