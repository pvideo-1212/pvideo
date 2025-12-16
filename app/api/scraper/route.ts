import { NextRequest, NextResponse } from 'next/server'
import {
  staticCategories,
  staticChannels,
  staticModels,
  getVideos,
  searchVideos
} from '@/lib/static-data'

// ============================================
// STATIC DATA API - NO SCRAPING
// ============================================

export async function GET(request: NextRequest) {
  const sp = new URL(request.url).searchParams
  const type = sp.get('type') || 'categories'
  const category = sp.get('category')
  const channel = sp.get('channel')
  const model = sp.get('model')
  const query = sp.get('q')
  const page = parseInt(sp.get('page') || '1')

  try {
    // Categories
    if (type === 'categories') {
      return NextResponse.json({ success: true, data: staticCategories })
    }

    // Channels
    if (type === 'channels') {
      return NextResponse.json({ success: true, data: staticChannels })
    }

    // Pornstars/Models
    if (type === 'pornstars' || type === 'models') {
      return NextResponse.json({ success: true, data: staticModels })
    }

    // Videos
    if (type === 'videos') {
      const result = getVideos({
        category: category || undefined,
        channel: channel || undefined,
        model: model || undefined,
        page
      })

      return NextResponse.json({
        success: true,
        data: {
          videos: result.videos,
          hasMore: result.hasMore,
          totalPages: result.totalPages
        },
        page,
      })
    }

    // Search
    if (type === 'search' && query) {
      const result = searchVideos(query, page)
      return NextResponse.json({
        success: true,
        data: {
          videos: result.videos,
          hasMore: result.hasMore,
        },
        page,
      })
    }

    // Stats
    if (type === 'stats') {
      return NextResponse.json({
        success: true,
        data: {
          message: 'Using static JSON data',
          videosCount: getVideos({}).videos.length,
          categoriesCount: staticCategories.length,
          channelsCount: staticChannels.length,
          modelsCount: staticModels.length
        }
      })
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  } catch (error) {
    console.error('[API] Error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

// POST - no longer needed for prefetch, but kept for compatibility
export async function POST(request: NextRequest) {
  return NextResponse.json({ success: true, message: 'No prefetch needed - using static data' })
}
