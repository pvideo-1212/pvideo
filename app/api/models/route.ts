// Models API Route
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { scrapeModelsFast } from '@/lib/scraper/scrape-fast'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const pageParam = searchParams.get('page')
  const page = Math.max(1, parseInt(pageParam || '1', 10) || 1)

  console.log('[API /api/models] Requested page:', page)

  try {
    const result = await scrapeModelsFast(page)
    console.log('[API /api/models] Got', result.items.length, 'models for page', page)

    return NextResponse.json({
      success: true,
      items: result.items,
      page: result.page,
      hasMore: result.hasMore,
    })
  } catch (error) {
    console.error('[API] /api/models error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch models' },
      { status: 500 }
    )
  }
}
