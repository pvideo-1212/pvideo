import { NextResponse } from 'next/server'

// Categories sitemap - fetches from eporner API
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pornhub1.fun'
  const today = new Date().toISOString().split('T')[0]

  // Default categories list (from eporner)
  const categories = [
    'amateur', 'anal', 'asian', 'babe', 'bbw', 'big-ass', 'big-dick', 'big-tits',
    'blonde', 'blowjob', 'brunette', 'college', 'compilation', 'creampie', 'cumshot',
    'ebony', 'european', 'fetish', 'fingering', 'gangbang', 'gay', 'hardcore',
    'hd-porn', 'indian', 'interracial', 'japanese', 'latina', 'lesbian', 'massage',
    'masturbation', 'mature', 'milf', 'pov', 'public', 'pussy-licking', 'reality',
    'redhead', 'romantic', 'rough-sex', 'school', 'small-tits', 'solo', 'squirt',
    'strap-on', 'teen', 'threesome', 'toys', 'vintage', 'webcam'
  ]

  const urls = categories.map(cat => `
  <url>
    <loc>${baseUrl}/category/${cat}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
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
