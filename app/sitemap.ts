import { MetadataRoute } from 'next'
// Use normal Playwright scraper to bypass Cloudflare
import { scrapeVideoList, scrapeModels, scrapeChannels } from '@/lib/scraper/scraper'

// Force dynamic - sitemap should be generated fresh each time
export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Cache for 1 hour
// Use Node.js runtime (not edge) for scraper compatibility
export const runtime = 'nodejs'

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
    console.log('[Sitemap] Fetching dynamic content with Playwright...')

    // Fetch pages with timeout protection
    // Google Search Console has strict timeout limits (usually 5-10 seconds)
    // We need to respond quickly, so use shorter timeouts per request
    // The scraper has built-in caching, so warm cache will be fast
    const fetchWithTimeout = async <T>(promise: Promise<T>, timeoutMs: number): Promise<T | null> => {
      try {
        return await Promise.race([
          promise,
          new Promise<null>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), timeoutMs)
          )
        ])
      } catch (e) {
        console.error('[Sitemap] Fetch timeout or error:', e)
        return null
      }
    }

    // Fetch just 1 page of each with aggressive timeout protection
    // Use shorter timeouts (2.5s each) to ensure total time < 8s for Google Search Console
    const [videosResult, modelsResult, channelsResult] = await Promise.all([
      fetchWithTimeout(scrapeVideoList(1), 2500),
      fetchWithTimeout(scrapeModels(1), 2500),
      fetchWithTimeout(scrapeChannels(1), 2500),
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
