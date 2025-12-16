import { NextResponse } from 'next/server'

// Static pages sitemap
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pornhub1.fun'
  const today = new Date().toISOString().split('T')[0]

  const staticPages = [
    { url: '/', priority: '1.0', freq: 'daily' },
    { url: '/categories', priority: '0.9', freq: 'weekly' },
    { url: '/channels', priority: '0.8', freq: 'weekly' },
    { url: '/pornstars', priority: '0.8', freq: 'weekly' },
    { url: '/terms', priority: '0.3', freq: 'monthly' },
    { url: '/privacy', priority: '0.3', freq: 'monthly' },
    { url: '/dmca', priority: '0.3', freq: 'monthly' },
    { url: '/contact', priority: '0.3', freq: 'monthly' },
  ]

  const urls = staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.freq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
