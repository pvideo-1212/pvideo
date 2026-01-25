import { MetadataRoute } from 'next'
// Use fast cheerio-based scraper for sitemap (no browser needed, more reliable)
import { scrapeVideoListFast, scrapeModelsFast, scrapeChannelsFast } from '@/lib/scraper/scrape-fast'

// Force dynamic - sitemap should be generated fresh each time
export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Cache for 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pornhub1.fun'

  // Static routes (always included)
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

  // Try to fetch dynamic content
  try {
    console.log('[Sitemap] Fetching dynamic content...')

    // Fetch pages with timeout protection
    const fetchWithTimeout = async <T>(promise: Promise<T>, timeoutMs: number): Promise<T | null> => {
      try {
        const result = await Promise.race([
          promise,
          new Promise<null>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), timeoutMs)
          )
        ])
        return result
      } catch (e) {
        console.error('[Sitemap] Fetch timeout or error:', e)
        return null
      }
    }

    // Fetch just 1 page of each to ensure fast response (<2s) and avoid GSC timeouts
    const [videosResult, modelsResult, channelsResult] = await Promise.all([
      fetchWithTimeout(scrapeVideoListFast(1), 5000),
      fetchWithTimeout(scrapeModelsFast(1), 5000),
      fetchWithTimeout(scrapeChannelsFast(1), 5000),
    ])

    console.log('[Sitemap] Videos:', videosResult?.items?.length || 0)
    console.log('[Sitemap] Models:', modelsResult?.items?.length || 0)
    console.log('[Sitemap] Channels:', channelsResult?.items?.length || 0)

    // Add Videos
    if (videosResult?.items) {
      videosResult.items.forEach((video: any) => {
        if (video.id) {
          routes.push({
            url: `${baseUrl}/video/${video.id}`,
            lastModified: new Date(),
            changeFrequency: 'hourly',
            priority: 0.9,
          })
        }
      })
    }

    // Add Models
    if (modelsResult?.items) {
      modelsResult.items.forEach((model: any) => {
        if (model.id) {
          routes.push({
            url: `${baseUrl}/models/${model.id}${model.slug ? `?slug=${model.slug}` : ''}`,
            lastModified: new Date(),
            changeFrequency: 'hourly',
            priority: 0.9,
          })
        }
      })
    }

    // Add Channels
    if (channelsResult?.items) {
      channelsResult.items.forEach((channel: any) => {
        if (channel.id) {
          routes.push({
            url: `${baseUrl}/channels/${channel.id}${channel.slug ? `?slug=${channel.slug}` : ''}`,
            lastModified: new Date(),
            changeFrequency: 'hourly',
            priority: 0.9,
          })
        }
      })
    }

    console.log('[Sitemap] Total URLs:', routes.length)

  } catch (error) {
    console.error('[Sitemap] Generation error:', error)
    // Still return static routes even if dynamic fails
  }

  return routes
}
