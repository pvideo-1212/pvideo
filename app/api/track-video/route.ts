import { NextRequest, NextResponse } from 'next/server'
import { trackVideo } from '@/lib/video-store'

// POST - Track a video view
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { id, title, thumbnail, duration, views, rating, categories } = body

    if (!id || !title) {
      return NextResponse.json(
        { success: false, error: 'Video ID and title are required' },
        { status: 400 }
      )
    }

    const tracked = await trackVideo({
      id,
      title,
      thumbnail,
      duration,
      views,
      rating,
      categories
    })

    if (tracked) {
      return NextResponse.json({
        success: true,
        message: 'Video tracked successfully'
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to track video' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('[TrackVideo API] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - Get store stats
export async function GET() {
  try {
    const { getStoreStats } = await import('@/lib/video-store')
    const stats = getStoreStats()
    return NextResponse.json({ success: true, ...stats })
  } catch (error) {
    console.error('[TrackVideo API] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
