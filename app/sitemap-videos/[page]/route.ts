import { NextRequest, NextResponse } from 'next/server'
import { getTrackedVideos, getTrackedVideoCount } from '@/lib/video-store'

// GET - Generate video sitemap for page
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ page: string }> }
) {
  const { page: pageParam } = await params
  const page = parseInt(pageParam) || 1
  const perPage = 200 // 200 videos per sitemap page

  // Validate page number
  if (page < 1 || page > 50) {
    return new NextResponse('Page not found', { status: 404 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pornhub1.fun'
  const today = new Date().toISOString().split('T')[0]

  // Get tracked videos for this page
  const videos = getTrackedVideos(page, perPage)
  const totalVideos = getTrackedVideoCount()

  // If no videos for this page, return empty sitemap
  if (videos.length === 0 && page > 1) {
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
</urlset>`,
      {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache 1 hour
        },
      }
    )
  }

  // Generate video sitemap entries
  const videoUrls = videos.map(video => {
    // Clean title for XML
    const cleanTitle = (video.title || 'Video')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .substring(0, 100)

    const cleanDescription = `Watch ${cleanTitle} - HD porn video streaming free`
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

    return `
  <url>
    <loc>${baseUrl}/watch/${video.id}</loc>
    <lastmod>${video.trackedAt?.split('T')[0] || today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <video:video>
      <video:thumbnail_loc>${video.thumbnail || `${baseUrl}/placeholder-thumb.jpg`}</video:thumbnail_loc>
      <video:title>${cleanTitle}</video:title>
      <video:description>${cleanDescription}</video:description>
      ${video.duration ? `<video:duration>${parseDurationToSeconds(video.duration)}</video:duration>` : ''}
      <video:family_friendly>no</video:family_friendly>
      <video:live>no</video:live>
    </video:video>
  </url>`
  }).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <!-- Page ${page} of video sitemap - ${videos.length} videos, ${totalVideos} total tracked -->${videoUrls}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache 1 hour
    },
  })
}

// Helper to parse duration string to seconds
function parseDurationToSeconds(duration: string): number {
  if (!duration) return 0

  // Handle HH:MM:SS or MM:SS format
  const parts = duration.split(':').map(p => parseInt(p) || 0)

  if (parts.length === 3) {
    // HH:MM:SS
    return parts[0] * 3600 + parts[1] * 60 + parts[2]
  } else if (parts.length === 2) {
    // MM:SS
    return parts[0] * 60 + parts[1]
  }

  return 0
}
