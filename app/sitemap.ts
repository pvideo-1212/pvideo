import { MetadataRoute } from 'next'
// Use fast scraper (cheerio-based) - Playwright doesn't work on Vercel
import { scrapeVideoListFast, scrapeModelsFast, scrapeChannelsFast } from '@/lib/scraper/scrape-fast'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Cache for 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pornhub1.fun' // Replace with actual production domain

  // static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/models`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/channels`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]

  try {
    // Helper to fetch multiple pages
    const fetchPages = async (fetcher: (page: number) => Promise<any>, pages: number) => {
      const promises = Array.from({ length: pages }, (_, i) => fetcher(i + 1))
      const results = await Promise.all(promises)
      return results.flatMap(r => r?.items || [])
    }

    // Fetch 5 pages (~100 items) of each category in parallel
    const [videos, models, channels] = await Promise.all([
      fetchPages(scrapeVideoListFast, 5),
      fetchPages(scrapeModelsFast, 5),
      fetchPages(scrapeChannelsFast, 5)
    ])

    // Add Videos
    videos.forEach((video: any) => {
      routes.push({
        url: `${baseUrl}/video/${video.id}`,
        lastModified: new Date(),
        changeFrequency: 'hourly',
        priority: 0.9,
      })
    })

    // Add Models
    models.forEach((model: any) => {
      routes.push({
        url: `${baseUrl}/models/${model.id}?slug=${model.slug}`,
        lastModified: new Date(),
        changeFrequency: 'hourly',
        priority: 0.9,
      })
    })

    // Add Channels
    channels.forEach((channel: any) => {
      routes.push({
        url: `${baseUrl}/channels/${channel.id}?slug=${channel.slug}`,
        lastModified: new Date(),
        changeFrequency: 'hourly',
        priority: 0.9,
      })
    })

  } catch (error) {
    console.error('Sitemap generation error:', error)
  }

  return routes
}
