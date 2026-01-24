// Playwright scraper - runs at build time on Railway (Docker support)
import { scrapeVideoList } from '@/lib/scraper/scraper'

// Static generation at build time - Playwright works on Railway
export const revalidate = 3600 // Revalidate every hour

export async function GET() {
  const baseUrl = 'https://pornhub1.fun' // Replace with actual domain

  // format duration string (e.g. "10:30") to Seconds (integer)
  const parseDurationToSeconds = (durationStr: string): number => {
    if (!durationStr) return 0
    const parts = durationStr.split(':').map(Number)
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
    if (parts.length === 2) return parts[0] * 60 + parts[1]
    return 0
  }

  // Fetch 5 pages of fresh videos
  const fetchPages = async (pages: number) => {
    const promises = Array.from({ length: pages }, (_, i) => scrapeVideoList(i + 1))
    const results = await Promise.all(promises)
    return results.flatMap(r => r?.items || [])
  }

  const videos = await fetchPages(5)

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${videos.map((video) => {
    const duration = parseDurationToSeconds(video.duration)
    const title = video.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    const thumbnail = video.thumbnail.replace(/&/g, '&amp;')

    return `  <url>
    <loc>${baseUrl}/video/${video.id}</loc>
    <changefreq>hourly</changefreq>
    <video:video>
      <video:thumbnail_loc>${thumbnail}</video:thumbnail_loc>
      <video:title>${title}</video:title>
      <video:description>Watch ${title} on TubeX. Free HD streaming.</video:description>
      <video:player_loc>${baseUrl}/video/${video.id}</video:player_loc>
      <video:duration>${duration}</video:duration>
      <video:publication_date>${new Date().toISOString()}</video:publication_date>
      <video:family_friendly>no</video:family_friendly>
      <video:live>no</video:live>
    </video:video>
  </url>`
  }).join('\n')}
</urlset>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'text/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
