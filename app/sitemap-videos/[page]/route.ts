import { NextRequest, NextResponse } from 'next/server'

type RouteContext = {
  params: Promise<{ page: string }>
}

// Fetch video sitemap from eporner and transform URLs
async function fetchEpornerSitemap(page: number): Promise<string[]> {
  const sitemapUrl = `https://www.eporner.com/sitemap/flv${page}.xml`

  // Try direct fetch first, then proxy
  const urls = [
    sitemapUrl,
    `https://corsproxy.io/?${encodeURIComponent(sitemapUrl)}`,
  ]

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)',
          'Accept': 'application/xml, text/xml',
        },
        signal: AbortSignal.timeout(15000),
        cache: 'no-store',
      })

      if (response.ok) {
        const xml = await response.text()

        // Extract video IDs using regex
        // Pattern: /video-([a-zA-Z0-9]+)/
        const regex = /\/video-([a-zA-Z0-9]+)\//g
        const videoIds: string[] = []
        let match

        while ((match = regex.exec(xml)) !== null) {
          if (match[1] && !videoIds.includes(match[1])) {
            videoIds.push(match[1])
          }
        }

        console.log(`[Sitemap] Fetched ${videoIds.length} video IDs from flv${page}.xml`)
        return videoIds
      }
    } catch (e) {
      console.log(`[Sitemap] Fetch failed for ${url}:`, (e as Error).message?.slice(0, 50))
    }
  }

  return []
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { page } = await context.params
  const pageNum = parseInt(page, 10)

  if (isNaN(pageNum) || pageNum < 1 || pageNum > 300) {
    return new NextResponse('Invalid page', { status: 400 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pornhub1.fun'
  const today = new Date().toISOString().split('T')[0]

  // Fetch video IDs from eporner sitemap
  const videoIds = await fetchEpornerSitemap(pageNum)

  // Generate URL entries
  const urls = videoIds.map(id => `
  <url>
    <loc>${baseUrl}/watch/${id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache 24 hours
    },
  })
}
