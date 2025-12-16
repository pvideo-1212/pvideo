const SITE_URL = 'https://pornhub1.fun'

export async function GET() {
  const today = new Date().toISOString().split('T')[0]

  const robotsTxt = `# Robots.txt for ${SITE_URL}
# Adult content site - 18+ only

User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /login
Disallow: /signup
Disallow: /profile

# Sitemaps
Sitemap: ${SITE_URL}/sitemap.xml
Sitemap: ${SITE_URL}/sitemap-videos.xml
Sitemap: ${SITE_URL}/sitemap-categories.xml
Sitemap: ${SITE_URL}/sitemap-channels.xml
Sitemap: ${SITE_URL}/sitemap-pornstars.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Allow search engines
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Yandex
Allow: /

# Block bad bots
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /

User-agent: MJ12bot
Disallow: /

# Last updated: ${today}
`

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
