// GET /api/search - Search videos

import { NextRequest, NextResponse } from 'next/server'
import { scrapeSearchFast } from '@/lib/scraper/scrape-fast'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    const page = parseInt(searchParams.get('page') || '1', 10)

    if (!query.trim()) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      )
    }

    if (page < 1 || page > 100) {
      return NextResponse.json(
        { success: false, error: 'Page must be between 1 and 100' },
        { status: 400 }
      )
    }

    const result = await scrapeSearchFast(query.trim(), page)

    return NextResponse.json({
      success: true,
      query: query.trim(),
      ...result,
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : ''
    console.error('[API] /api/search error:', errorMessage)
    console.error('[API] Stack:', errorStack)
    return NextResponse.json(
      { success: false, error: `Search failed: ${errorMessage}` },
      { status: 500 }
    )
  }
}

// Force dynamic rendering
export const dynamic = 'force-dynamic'
