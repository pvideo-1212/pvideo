// Use fast cheerio-based scraper (no browser needed, more reliable)
import { scrapeVideoList } from '@/lib/scraper/scraper'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 3600

export async function GET() {
  const baseUrl = 'https://pornhub1.fun'

  try {
    console.log('[VideoSitemap] Generating...')

    // Fetch just 3 pages for faster response
    const fetchPages = async (pages: number) => {
      const promises = Array.from({ length: pages }, (_, i) => scrapeVideoList(i + 1))
      const results = await Promise.all(promises)
      return results.flatMap(r => r?.items || [])
    }

    const videos = await fetchPages(1)
    console.log('[VideoSitemap] Found', videos.length, 'videos')

    // Generate XML sitemap
    const urlElements = videos
      .filter((v: any) => v.id)
      .map((video: any) => `
    <url>
      <loc>${baseUrl}/video/${video.id}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>hourly</changefreq>
      <priority>0.9</priority>
    </url>`)
      .join('')

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlElements}
</urlset>`

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })

  } catch (error) {
    console.error('[VideoSitemap] Error:', error)

    // Return minimal valid sitemap on error
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
</urlset>`

    return new Response(fallbackSitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    })
  }
}
