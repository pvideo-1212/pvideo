// Use Playwright scraper (required to bypass Cloudflare)
import { scrapeVideoList } from '@/lib/scraper/scraper'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 3600
// Use Node.js runtime (not edge) for scraper compatibility
export const runtime = 'nodejs'

// Timeout wrapper to ensure Google gets a response within their limits
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T | null> {
  try {
    return await Promise.race([
      promise,
      new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), timeoutMs)
      )
    ])
  } catch (error) {
    console.error('[VideoSitemap] Timeout or error:', error)
    return null
  }
}

export async function GET() {
  const baseUrl = 'https://pornhub1.fun'
  const startTime = Date.now()

  // Google Search Console has strict timeout limits (usually 5-10 seconds)
  // We need to respond quickly, so use 8 seconds max
  // The scraper has built-in caching, so warm cache will be fast
  // If scraping times out, we return a valid fallback sitemap immediately
  const MAX_GENERATION_TIME = 8000

  try {
    console.log('[VideoSitemap] Generating with Playwright...')

    // Use Playwright scraper with aggressive timeout protection
    // Fetch just 1 page to ensure fast response for Google
    // The scraper has built-in caching, so subsequent requests will be fast
    const videosResult = await withTimeout(
      scrapeVideoList(1),
      MAX_GENERATION_TIME - 1500 // Leave 1.5s buffer for XML generation
    )

    const videos = videosResult?.items || []
    console.log('[VideoSitemap] Found', videos.length, 'videos')

    // Generate XML sitemap
    const urlElements = videos
      .filter((v: any) => v && v.id)
      .map((video: any) => `
    <url>
      <loc>${baseUrl}/video/${video.id}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>hourly</changefreq>
      <priority>0.9</priority>
    </url>`)
      .join('')

    // Always include at least the homepage to ensure valid sitemap
    const homepageUrl = `
    <url>
      <loc>${baseUrl}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
    </url>`

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${homepageUrl}${urlElements}
</urlset>`.trim()

    const generationTime = Date.now() - startTime
    console.log(`[VideoSitemap] Generated in ${generationTime}ms with ${videos.length + 1} URLs`)

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'X-Content-Type-Options': 'nosniff',
      },
    })

  } catch (error) {
    console.error('[VideoSitemap] Error:', error)

    // Return minimal valid sitemap on error - Google requires valid XML
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`

    return new Response(fallbackSitemap, {
      status: 200, // Always return 200, even on error, so Google doesn't mark it as failed
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  }
}
