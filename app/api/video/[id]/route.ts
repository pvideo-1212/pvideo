// GET /api/video/[id] - Video details with streams

import { NextRequest, NextResponse } from 'next/server'
import { scrapeVideoDetails } from '@/lib/scraper/scraper'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id || !/^[a-z0-9]+$/i.test(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid video ID' },
        { status: 400 }
      )
    }

    const video = await scrapeVideoDetails(id)

    if (!video) {
      return NextResponse.json(
        { success: false, error: 'Video not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: video,
    })

  } catch (error) {
    console.error('[API] /api/video/[id] error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch video details' },
      { status: 500 }
    )
  }
}

// Force dynamic rendering
export const dynamic = 'force-dynamic'
