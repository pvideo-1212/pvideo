import { NextRequest, NextResponse } from 'next/server'
import { getVideoByUrl, getVideoById } from '@/lib/static-data'

// ============================================
// STATIC VIDEO SOURCES - NO SCRAPING
// ============================================

function extractVideoId(url: string): string {
  const match = url.match(/\/videos?\/?([^\/\?]+)/)
  return match ? match[1] : url.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50)
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  const { searchParams } = new URL(request.url)
  const pageUrl = searchParams.get('url')
  const quality = searchParams.get('quality')

  if (!pageUrl) {
    return NextResponse.json({ error: 'url parameter is required' }, { status: 400 })
  }

  const videoId = extractVideoId(pageUrl)

  // Look up video in static data
  let video = getVideoByUrl(pageUrl)
  if (!video) {
    video = getVideoById(videoId)
  }

  if (!video || !video.videoSources || video.videoSources.length === 0) {
    return NextResponse.json({
      success: false,
      directUrl: '',
      sources: [],
      qualities: [],
      error: 'Video sources not found in static data',
      strategy: 'STATIC',
      elapsed: Date.now() - startTime,
      videoId
    })
  }

  // Transform videoSources to expected format
  const sources = video.videoSources
    .filter(s => s.src && s.quality)
    .map(s => ({
      url: s.src,
      quality: s.quality.replace('p', '').replace('auto (', '').replace(')', '').replace('default', '480')
    }))

  // Sort by quality (highest first)
  sources.sort((a, b) => (parseInt(b.quality) || 0) - (parseInt(a.quality) || 0))

  // Select best URL based on preferred quality
  const targetQuality = quality || '720'
  let selectedUrl = sources[0]?.url || ''
  for (const s of sources) {
    if (s.quality === targetQuality) {
      selectedUrl = s.url
      break
    }
  }

  const elapsed = Date.now() - startTime

  return NextResponse.json({
    success: true,
    directUrl: selectedUrl,
    sources,
    qualities: sources.map(s => s.quality),
    title: video.title,
    strategy: 'STATIC',
    elapsed,
    videoId,
  })
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const { pageUrl, quality } = await request.json()

    if (!pageUrl) {
      return NextResponse.json({ error: 'pageUrl is required' }, { status: 400 })
    }

    const videoId = extractVideoId(pageUrl)

    // Look up video in static data
    let video = getVideoByUrl(pageUrl)
    if (!video) {
      video = getVideoById(videoId)
    }

    if (!video || !video.videoSources || video.videoSources.length === 0) {
      return NextResponse.json({
        success: false,
        directUrl: '',
        sources: [],
        qualities: [],
        error: 'Video sources not found in static data',
        strategy: 'STATIC',
        elapsed: Date.now() - startTime,
        videoId
      })
    }

    // Transform and sort sources
    const sources = video.videoSources
      .filter(s => s.src && s.quality)
      .map(s => ({
        url: s.src,
        quality: s.quality.replace('p', '').replace('auto (', '').replace(')', '').replace('default', '480')
      }))
      .sort((a, b) => (parseInt(b.quality) || 0) - (parseInt(a.quality) || 0))

    // Select URL
    const targetQuality = quality || '720'
    let selectedUrl = sources[0]?.url || ''
    for (const s of sources) {
      if (s.quality === targetQuality) {
        selectedUrl = s.url
        break
      }
    }

    return NextResponse.json({
      success: true,
      directUrl: selectedUrl,
      sources,
      qualities: sources.map(s => s.quality),
      title: video.title,
      strategy: 'STATIC',
      elapsed: Date.now() - startTime,
      videoId,
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to get video sources',
      strategy: 'STATIC'
    }, { status: 500 })
  }
}

// Prefetch - no-op with static data
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, { status: 204 })
}

// Stats
export async function PATCH() {
  return NextResponse.json({
    strategy: 'STATIC',
    message: 'Using pre-scraped video sources from data.json'
  })
}
