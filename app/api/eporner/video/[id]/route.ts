import { NextRequest } from 'next/server'

type RouteContext = {
  params: Promise<{ id: string }>
}

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
  default_thumb: { src: string }
  thumbs: { src: string }[]
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
    title: video.title,
    url: video.url || '',
    embedUrl: video.embed || `https://www.eporner.com/embed/${video.id}/`,
    thumbnail: video.default_thumb?.src || '',
    thumbs: video.thumbs?.map(t => t.src) || [],
    duration: video.length_min || '',
    durationSec: video.length_sec || 0,
    views: formatViews(video.views || 0),
    viewsCount: video.views || 0,
    rating: video.rate || '0',
    keywords: video.keywords || '',
    categories: (video.keywords || '').split(',').map(k => k.trim()).filter(k => k && k.length > 1).slice(0, 10),
    addedDate: video.added || '',
    videoSources: [{
      src: video.embed || `https://www.eporner.com/embed/${video.id}/`,
      quality: 'HD',
      type: 'embed'
    }]
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params

  if (!id) {
    return Response.json({ success: false, error: 'Video ID required' }, { status: 400 })
  }

  // Search for video by ID
  const searchUrl = `https://www.eporner.com/api/v2/video/search/?query=${encodeURIComponent(id)}&per_page=10&thumbsize=big&format=json`

  console.log('[Video API] Fetching:', id)

  try {
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (response.ok) {
      const data = await response.json()
      const video = data.videos?.find((v: ApiVideo) => v.id === id)

      if (video) {
        console.log('[Video API] Found:', video.title)
        return Response.json({ success: true, data: transformVideo(video) })
      }
    }
  } catch (error) {
    console.error('[Video API] Error:', error)
  }

  // Return fallback for embedding even if not found
  console.log('[Video API] Using fallback for:', id)
  return Response.json({
    success: true,
    data: {
      id,
      title: id.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      url: `https://www.eporner.com/video-${id}/`,
      embedUrl: `https://www.eporner.com/embed/${id}/`,
      thumbnail: '',
      thumbs: [],
      duration: '',
      durationSec: 0,
      views: '0',
      viewsCount: 0,
      rating: '0',
      keywords: '',
      categories: [],
      addedDate: '',
      videoSources: [{ src: `https://www.eporner.com/embed/${id}/`, quality: 'HD', type: 'embed' }]
    }
  })
}
