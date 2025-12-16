import { NextResponse } from 'next/server'

// Sitemap index - references all video sitemaps and static pages
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pornhub1.fun'
  const today = new Date().toISOString().split('T')[0]

  // Generate sitemap index with video sitemaps (fetch first 50 from eporner)
  const videoSitemaps = Array.from({ length: 50 }, (_, i) => `
  <sitemap>
    <loc>${baseUrl}/sitemap-videos/${i + 1}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-static.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-categories.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-channels.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-pornstars.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>${videoSitemaps}
</sitemapindex>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache 24 hours
    },
  })
}
