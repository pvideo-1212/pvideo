import { NextRequest } from 'next/server'

// Direct server-side fetching from eporner API
// Works when deployed on servers outside India (USA, EU, etc.)

interface ApiVideo {
  id: string
  title: string
  keywords: string
  views: number
  rate: string
  url: string
  added: string
  length_sec: number
  length_min: string
  embed: string
  default_thumb: { src: string; width: number; height: number }
  thumbs: { src: string; width: number; height: number }[]
}

function formatViews(views: number): string {
  if (!views) return '0'
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
  return String(views)
}

function transformVideo(video: ApiVideo) {
  return {
    id: video.id,
    title: video.title || '',
    thumbnail: video.default_thumb?.src || '',
    thumbs: video.thumbs?.map(t => t.src) || [],
    duration: video.length_min || '',
    durationSec: video.length_sec || 0,
    views: formatViews(video.views || 0),
    viewsCount: video.views || 0,
    rating: video.rate || '0',
    url: video.url || '',
    embedUrl: video.embed || `https://www.eporner.com/embed/${video.id}/`,
    keywords: video.keywords || '',
    categories: (video.keywords || '').split(',').map(k => k.trim().toLowerCase()).filter(k => k && k.length > 1).slice(0, 10),
    addedDate: video.added || '',
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const query = searchParams.get('query') || 'all'
  const page = searchParams.get('page') || '1'
  const perPage = searchParams.get('per_page') || '24'
  const order = searchParams.get('order') || 'top-weekly'

  // Build eporner API URL
  const baseUrl = 'https://www.eporner.com/api/v2/video/search/'
  const params = new URLSearchParams({
    query,
    per_page: perPage,
    page,
    thumbsize: 'big',
    order,
    gay: '1',
    lq: '1',
    format: 'json'
  })

  const directUrl = `${baseUrl}?${params.toString()}`

  // Multiple proxy fallbacks for reliability
  const proxyUrls = [
    `https://corsproxy.io/?${encodeURIComponent(directUrl)}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(directUrl)}`,
  ]

  console.log('[API] Fetching:', query, 'page:', page)

  async function tryFetch(url: string, timeout: number): Promise<Response | null> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(timeout),
        cache: 'no-store'
      })
      if (response.ok) return response
    } catch (e) {
      console.log('[API] Fetch failed:', (e as Error).message?.slice(0, 50))
    }
    return null
  }

  try {
    let response: Response | null = null

    for (const proxyUrl of proxyUrls) {
      response = await tryFetch(proxyUrl, 15000)
      if (response) break
      console.log('[API] Trying next proxy...')
    }

    if (!response) {
      console.error('[API] All fetch attempts failed')
      return Response.json({
        success: false,
        error: 'Unable to fetch videos',
        videos: [],
        totalPages: 0,
        totalCount: 0,
      }, { status: 503 })
    }

    const data = await response.json()
    const videos = (data.videos || []).map(transformVideo)

    console.log('[API] Success:', videos.length, 'videos from', data.total_count, 'total')

    return Response.json({
      success: true,
      videos,
      totalPages: data.total_pages || 0,
      totalCount: data.total_count || 0,
      page: data.page || parseInt(page),
      perPage: data.per_page || parseInt(perPage),
      count: data.count || videos.length,
    })

  } catch (error) {
    console.error('[API] Exception:', error)
    return Response.json({
      success: false,
      error: 'Failed to fetch videos',
      videos: [],
      totalPages: 0,
      totalCount: 0,
    }, { status: 500 })
  }
}
