import { NextResponse } from 'next/server'

// Pornstars sitemap - fetches from eporner pornstars sitemap
async function fetchPornstarsSitemap(): Promise<string[]> {
  const sitemapUrl = 'https://www.eporner.com/sitemap/pornstars1.xml'

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

        // Extract pornstar slugs from URLs like /pornstar/name/
        const regex = /\/pornstar\/([a-z0-9-]+)\//gi
        const slugs: string[] = []
        let match

        while ((match = regex.exec(xml)) !== null) {
          if (match[1] && !slugs.includes(match[1])) {
            slugs.push(match[1])
          }
          // Limit to 500 pornstars per sitemap
          if (slugs.length >= 500) break
        }

        console.log(`[Sitemap] Fetched ${slugs.length} pornstar slugs`)
        return slugs
      }
    } catch (e) {
      console.log(`[Sitemap] Pornstars fetch failed:`, (e as Error).message?.slice(0, 50))
    }
  }

  // Fallback to common pornstars if fetch fails
  return [
    'mia-khalifa', 'lana-rhoades', 'riley-reid', 'abella-danger', 'angela-white',
    'brandi-love', 'lisa-ann', 'alexis-texas', 'nicole-aniston', 'madison-ivy',
    'sasha-grey', 'asa-akira', 'jenna-jameson', 'mia-malkova', 'elsa-jean',
    'eva-lovia', 'dillion-harper', 'keisha-grey', 'adriana-chechik', 'kendra-lust',
    'julia-ann', 'cherie-deville', 'alexis-fawx', 'india-summer', 'syren-de-mer'
  ]
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pornhub1.fun'
  const today = new Date().toISOString().split('T')[0]

  const pornstars = await fetchPornstarsSitemap()

  const urls = pornstars.map(ps => `
  <url>
    <loc>${baseUrl}/pornstar/${ps}</loc>
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
