// Channels API Route
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { scrapeChannels } from '@/lib/scraper/scraper'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const pageParam = searchParams.get('page')
  const page = Math.max(1, parseInt(pageParam || '1', 10) || 1)

  console.log('[API /api/channels] Requested page:', page)

  try {
    const result = await scrapeChannels(page)
    console.log('[API /api/channels] Got', result.items.length, 'channels for page', page)

    return NextResponse.json({
      success: true,
      items: result.items,
      page: result.page,
      hasMore: result.hasMore,
    })
  } catch (error) {
    console.error('[API] /api/channels error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch channels' },
      { status: 500 }
    )
  }
}
