import { NextResponse } from 'next/server'

// Channels/Sites sitemap - with sample channels
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pornhub1.fun'
  const today = new Date().toISOString().split('T')[0]

  // Sample channels/sites
  const channels = [
    'brazzers', 'bangbros', 'reality-kings', 'naughty-america', 'mofos',
    'blacked', 'tushy', 'vixen', 'deeper', 'digital-playground',
    'pure-taboo', 'fake-taxi', 'fake-agent', 'fake-hospital', 'family-strokes',
    'sislovesme', 'teamskeet', 'passion-hd', 'babes', 'x-art',
    'met-art', 'sex-art', 'nubile-films', 'private', 'evil-angel',
    'jules-jordan', 'hard-x', 'elegant-angel', 'new-sensations', 'sweet-sinner'
  ]

  const urls = channels.map(ch => `
  <url>
    <loc>${baseUrl}/channel/${ch}</loc>
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
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
