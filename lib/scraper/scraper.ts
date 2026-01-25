// Main Scraper with Playwright

import { chromium, Browser, BrowserContext, Page } from 'playwright'
import { config, getRandomUserAgent, buildUrl } from './config'
import type { VideoItem, VideoDetails, VideoStream, PaginatedResponse, ModelItem, ChannelItem } from './types'

// Simple in-memory cache
const cache = new Map<string, { data: unknown; timestamp: number }>()

function getCached<T>(key: string): T | null {
  const entry = cache.get(key)
  if (entry && Date.now() - entry.timestamp < config.cacheDuration) {
    return entry.data as T
  }
  cache.delete(key)
  return null
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() })
}

// Browser and context singletons - ONE instance shared across all requests
let browserInstance: Browser | null = null
let contextInstance: BrowserContext | null = null

async function getContext(): Promise<BrowserContext> {
  if (!browserInstance) {
    browserInstance = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-gpu',
        '--disable-software-rasterizer',
        '--disable-extensions',
        '--disable-background-networking',
        '--disable-sync',
        '--disable-translate',
        '--no-first-run',
        '--disable-default-apps',
        '--mute-audio',
      ],
    })
  }

  if (!contextInstance) {
    contextInstance = await browserInstance.newContext({
      userAgent: getRandomUserAgent(),
      viewport: config.viewport,
      ignoreHTTPSErrors: true,
      javaScriptEnabled: true,
    })

    // Anti-detection
    await contextInstance.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => undefined })
      Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] })
    })

    // Block heavy resources - images, fonts, CSS to speed up loading
    await contextInstance.route('**/*', (route) => {
      const resourceType = route.request().resourceType()
      const url = route.request().url()

      // Block images, fonts, media, and tracking scripts
      if (['image', 'font', 'media', 'stylesheet'].includes(resourceType)) {
        return route.abort()
      }

      // Block known ad/tracking domains
      if (url.includes('google-analytics') ||
        url.includes('doubleclick') ||
        url.includes('facebook') ||
        url.includes('twitter') ||
        url.includes('analytics')) {
        return route.abort()
      }

      return route.continue()
    })
  }

  return contextInstance
}

// Get a new page from the shared context
async function getPage(): Promise<Page> {
  const context = await getContext()
  return context.newPage()
}

// Scrape video list from listing page
export async function scrapeVideoList(page: number = 1): Promise<PaginatedResponse<VideoItem>> {
  console.log('[Scraper] scrapeVideoList called with page:', page)

  const cacheKey = `list_${page}`
  const cached = getCached<PaginatedResponse<VideoItem>>(cacheKey)
  if (cached) {
    console.log('[Scraper] Returning cached data for page:', page)
    return { ...cached, items: cached.items.map(i => ({ ...i })) }
  }

  const browserPage = await getPage()

  try {
    // Build URL: /new_videos/ for page 1, /new_videos/{page}/ for other pages
    let url = config.baseUrl + config.paths.listing
    if (page > 1) {
      url += page + '/'
    }
    console.log('[Scraper] Fetching URL:', url)
    await browserPage.goto(url, { waitUntil: 'domcontentloaded', timeout: config.timeout.navigation })
    // Wait for video cards to appear
    await browserPage.waitForSelector('.js-video-item, [data-testid="video-item"]', { timeout: config.timeout.scrape }).catch(() => { })

    // Extract videos - thumbnails come from data-src, no scrolling needed
    const items: VideoItem[] = await browserPage.evaluate(() => {
      const results: Array<{ id: string, title: string, thumbnail: string, duration: string, views: string, quality: string, channel: string, url: string }> = []
      const seen = new Set<string>()

      // Find all video card containers
      document.querySelectorAll('.js-video-item, [data-testid="video-item"]').forEach((card) => {
        // Find title link inside the card
        const titleLink = card.querySelector('a[href*="/video/"][title]') as HTMLAnchorElement | null
        if (!titleLink) return

        const href = titleLink.getAttribute('href') || ''
        const idMatch = href.match(/^\/([a-z0-9]+)\/video\//i)
        if (!idMatch) return

        const id = idMatch[1]
        if (seen.has(id)) return
        seen.add(id)

        const title = titleLink.getAttribute('title') || ''
        if (!title || title.length < 3) return

        // Find thumbnail: look for picture > img or just img in the card
        let thumbnail = ''
        const img = card.querySelector('picture img, a.relative img, a img') as HTMLImageElement | null
        if (img) {
          // Prioritize data-src (lazy load source) over src (may be placeholder)
          const dataSrc = img.getAttribute('data-src') || ''
          const src = img.src || ''
          // Use data-src if it looks like a real image URL
          if (dataSrc && dataSrc.includes('http')) {
            thumbnail = dataSrc
          } else if (src && !src.includes('blank') && !src.includes('placeholder') && src.includes('http')) {
            thumbnail = src
          }
          if (thumbnail.startsWith('//')) thumbnail = 'https:' + thumbnail
        }

        // Find duration from data-testid element
        let duration = ''
        const durationEl = card.querySelector('[data-testid="video-item-length"]')
        if (durationEl) {
          duration = durationEl.textContent?.trim() || ''
        }
        if (!duration) {
          // Fallback: look for span with time format
          const spans = card.querySelectorAll('span')
          spans.forEach(span => {
            const text = span.textContent?.trim() || ''
            if (/^\d+m$|^\d+:\d+$/.test(text)) {
              duration = text
            }
          })
        }

        // Check for quality badge
        let quality = 'HD'
        const hdBadge = card.querySelector('[class*="hd"], [class*="4k"]')
        if (hdBadge) {
          const text = hdBadge.textContent?.trim()?.toUpperCase() || ''
          if (text.includes('4K')) quality = '4K'
        }

        results.push({
          id,
          title: title.slice(0, 200),
          thumbnail,
          duration,
          views: '',
          quality,
          channel: '',
          url: 'https://spankbang.party' + href,
        })
      })

      return results
    })

    const result: PaginatedResponse<VideoItem> = {
      items,
      page,
      hasMore: items.length >= 20,
    }

    setCache(cacheKey, result)
    return result

  } finally {
    await browserPage.close()
  }
}

// Scrape video details with streams - OPTIMIZED for speed
export async function scrapeVideoDetails(videoId: string): Promise<VideoDetails | null> {
  const cacheKey = `video_${videoId}`
  const cached = getCached<VideoDetails>(cacheKey)
  if (cached) return { ...cached }

  const browserPage = await getPage()

  try {
    const url = buildUrl(config.paths.video, { id: videoId })
    // Use domcontentloaded, wait for specific conditions if needed but avoid arbitrary timeouts
    await browserPage.goto(url, { waitUntil: 'domcontentloaded', timeout: config.timeout.navigation })

    const details = await browserPage.evaluate(() => {
      // Basic info
      const title = document.querySelector('h1')?.textContent?.trim() ||
        document.querySelector('title')?.textContent?.split(' - ')[0]?.trim() || ''
      const views = document.querySelector('span.views')?.textContent?.trim() || ''
      const duration = document.querySelector('.vjs-duration-display')?.textContent?.trim() || ''
      const channel = document.querySelector('.channel-by a')?.textContent?.trim() || ''
      const thumbnail = document.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
        (document.querySelector('video') as HTMLVideoElement)?.poster || ''
      const description = document.querySelector('.description')?.textContent?.trim() ||
        document.querySelector('meta[name="description"]')?.getAttribute('content') || ''

      // Categories
      const categories: string[] = []
      document.querySelectorAll('.searches a[href^="/s/"]').forEach((el) => {
        const text = el.textContent?.trim()
        if (text && text.length > 1) categories.push(text)
      })

      // Tags
      const tags: string[] = []
      document.querySelectorAll('.tags-info a, .video-tags a').forEach((el) => {
        const text = el.textContent?.trim()
        if (text && text.length > 1) tags.push(text)
      })

      // Stream extraction - ONLY MP4
      const streams: { quality: string; url: string; type: 'mp4' }[] = []
      const seenUrls = new Set<string>()

      document.querySelectorAll('script').forEach((script) => {
        const content = script.textContent || ''

        // Method 1: stream_data object (most reliable)
        const streamMatch = content.match(/stream_data\s*=\s*(\{[\s\S]*?\});/)
        if (streamMatch) {
          try {
            const data = JSON.parse(streamMatch[1].replace(/'/g, '"'))
            Object.entries(data).forEach(([quality, urls]) => {
              // Check if array has items and is a string
              if (Array.isArray(urls) && urls[0] && typeof urls[0] === 'string') {
                const streamUrl = urls[0];
                if (streamUrl.startsWith('http') && !streamUrl.includes('.m3u8')) {
                  if (!seenUrls.has(streamUrl)) {
                    seenUrls.add(streamUrl)
                    streams.push({
                      quality: quality.toUpperCase() === '4K' ? '4K' : quality,
                      url: streamUrl,
                      type: 'mp4',
                    })
                  }
                }
              }
            })
          } catch { }
        }

        // Method 2: Direct URL patterns in scripts
        // Strict pattern for MP4s only
        const urlMatches = content.matchAll(/["']?(https?:\/\/[^"'\s]+\.mp4[^"'\s]*)["']?/gi)
        for (const match of urlMatches) {
          const streamUrl = match[1]
          if (!seenUrls.has(streamUrl) && !streamUrl.includes('preview') && !streamUrl.includes('thumb') && !streamUrl.includes('.m3u8')) {
            seenUrls.add(streamUrl)
            const qualityMatch = streamUrl.match(/(\d{3,4})p/i) || streamUrl.match(/_(4k|2160|1080|720|480|360|240)/i)
            let quality = 'auto'
            if (qualityMatch) {
              const q = qualityMatch[1].toLowerCase()
              if (q === '4k' || q === '2160') quality = '4K'
              else if (q === '1080') quality = '1080p'
              else if (q === '720') quality = '720p'
              else if (q === '480') quality = '480p'
              else if (q === '360') quality = '360p'
              else if (q === '240') quality = '240p'
              else quality = `${q}p`
            }
            streams.push({
              quality,
              url: streamUrl,
              type: 'mp4',
            })
          }
        }
      })

      return { title, views, duration, channel, thumbnail, description, categories, tags, streams }
    })

    if (!details.title) return null

    // Filter and sort streams - HIGHER QUALITY FIRST
    const filteredStreams = details.streams.sort((a, b) => {
      const qualityOrder: Record<string, number> = {
        '4k': 7, '4K': 7, '2160p': 7,
        '1080p': 6,
        '720p': 5,
        '480p': 4,
        '360p': 3,
        '240p': 2,
        'auto': 1
      }
      return (qualityOrder[b.quality] || 0) - (qualityOrder[a.quality] || 0)
    })

    const result: VideoDetails = {
      id: videoId,
      title: details.title.slice(0, 200),
      thumbnail: details.thumbnail,
      duration: details.duration,
      views: details.views,
      quality: filteredStreams.some(s => ['4k', '4K', '2160p', '1080p'].includes(s.quality)) ? '4K' : 'HD',
      channel: details.channel,
      url: `https://spankbang.party/${videoId}/video/`,
      description: details.description,
      categories: details.categories,
      tags: details.tags,
      streams: filteredStreams,
    }

    setCache(cacheKey, result)
    return result

  } finally {
    await browserPage.close()
  }
}

// Scrape search results
export async function scrapeSearch(query: string, page: number = 1): Promise<PaginatedResponse<VideoItem>> {
  const cacheKey = `search_${query}_${page}`
  const cached = getCached<PaginatedResponse<VideoItem>>(cacheKey)
  if (cached) return { ...cached, items: cached.items.map(i => ({ ...i })) }

  const browserPage = await getPage()

  try {
    // Build search URL: /s/{query}/ for page 1, /s/{query}/{page}/ for other pages
    // SpankBang uses raw query with spaces replaced by + (no URL encoding)
    const cleanQuery = query.trim().toLowerCase().replace(/\s+/g, '+')
    let url = config.baseUrl + '/s/' + cleanQuery + '/'
    if (page > 1) {
      url += page + '/'
    }

    console.log('[Search] Query:', query, '-> Clean:', cleanQuery)
    console.log('[Search] URL:', url)
    await browserPage.goto(url, { waitUntil: 'domcontentloaded', timeout: config.timeout.navigation })

    // Wait for video cards to appear
    await browserPage.waitForSelector('.js-video-item, [data-testid="video-item"]', { timeout: config.timeout.scrape }).catch(() => { })

    // Extract videos by finding all video card containers
    const items: VideoItem[] = await browserPage.evaluate(() => {
      const results: Array<{ id: string, title: string, thumbnail: string, duration: string, views: string, quality: string, channel: string, url: string }> = []
      const seen = new Set<string>()

      // Find all video card containers
      document.querySelectorAll('.js-video-item, [data-testid="video-item"]').forEach((card) => {
        // Find title link inside the card
        const titleLink = card.querySelector('a[href*="/video/"][title]') as HTMLAnchorElement | null
        if (!titleLink) return

        const href = titleLink.getAttribute('href') || ''
        const idMatch = href.match(/^\/([a-z0-9]+)\/video\//i)
        if (!idMatch) return

        const id = idMatch[1]
        if (seen.has(id)) return
        seen.add(id)

        const title = titleLink.getAttribute('title') || ''
        if (!title || title.length < 3) return

        // Find thumbnail
        let thumbnail = ''
        const img = card.querySelector('picture img, a.relative img, a img') as HTMLImageElement | null
        if (img) {
          thumbnail = img.src || img.getAttribute('data-src') || ''
          if (thumbnail.startsWith('//')) thumbnail = 'https:' + thumbnail
        }

        // Find duration
        let duration = ''
        const durationEl = card.querySelector('[data-testid="video-item-length"]')
        if (durationEl) {
          duration = durationEl.textContent?.trim() || ''
        }
        if (!duration) {
          const spans = card.querySelectorAll('span')
          spans.forEach(span => {
            const text = span.textContent?.trim() || ''
            if (/^\d+m$|^\d+:\d+$/.test(text)) {
              duration = text
            }
          })
        }

        // Check quality
        let quality = 'HD'
        const hdBadge = card.querySelector('[class*="hd"], [class*="4k"]')
        if (hdBadge) {
          const text = hdBadge.textContent?.trim()?.toUpperCase() || ''
          if (text.includes('4K')) quality = '4K'
        }

        results.push({
          id,
          title: title.slice(0, 200),
          thumbnail,
          duration,
          views: '',
          quality,
          channel: '',
          url: 'https://spankbang.party' + href,
        })
      })

      return results
    })

    const result: PaginatedResponse<VideoItem> = {
      items,
      page,
      hasMore: items.length >= 20,
    }

    setCache(cacheKey, result)
    return result

  } finally {
    await browserPage.close()
  }
}

// Scrape models/pornstars listing
export async function scrapeModels(page: number = 1): Promise<PaginatedResponse<ModelItem>> {
  const cacheKey = `models_${page}`
  const cached = getCached<PaginatedResponse<ModelItem>>(cacheKey)
  if (cached) return { ...cached, items: cached.items.map(i => ({ ...i })) }

  const browserPage = await getPage()

  try {
    let url = config.baseUrl + config.paths.models
    if (page > 1) {
      url += page + '/'
    }
    console.log('[Scraper] Fetching models URL:', url)
    await browserPage.goto(url, { waitUntil: 'domcontentloaded', timeout: config.timeout.navigation })
    await browserPage.waitForSelector('a[href*="/pornstar/"]', { timeout: config.timeout.scrape }).catch(() => { })

    // Extract models - thumbnails come from data-src, no scrolling needed
    const items: ModelItem[] = await browserPage.evaluate(() => {
      const results: Array<{ id: string, name: string, slug: string, thumbnail: string, viewCount: string, videoCount: string, url: string }> = []
      const seen = new Set<string>()

      // Find model cards - look for links to pornstar pages
      document.querySelectorAll('a[href*="/pornstar/"]').forEach((link) => {
        const href = link.getAttribute('href') || ''
        // Match pattern: /{id}/pornstar/{slug}/
        const match = href.match(/^\/([a-z0-9]+)\/pornstar\/([^/]+)/i)
        if (!match) return

        const id = match[1]
        if (seen.has(id)) return
        seen.add(id)

        const slug = match[2]

        // Get name from link text or title
        let name = link.getAttribute('title') || link.textContent?.trim() || ''
        name = name.replace(/[+_]/g, ' ').trim()
        if (!name || name.length < 2) return

        // Find thumbnail - look in the link itself first, then parent containers
        let thumbnail = ''

        // Method 1: Check if the link itself contains an image
        let img = link.querySelector('img') as HTMLImageElement | null

        // Method 2: Check parent containers
        if (!img) {
          // Try various parent selectors
          const card = link.closest('.model-item, .pornstar-item, .item, [class*="model"], [class*="pornstar"]') ||
            link.parentElement?.parentElement
          if (card) {
            img = card.querySelector('img') as HTMLImageElement | null
          }
        }

        // Method 3: Check siblings
        if (!img && link.parentElement) {
          img = link.parentElement.querySelector('img') as HTMLImageElement | null
        }

        if (img) {
          // Prioritize data-src (lazy load) over src
          const dataSrc = img.getAttribute('data-src') || ''
          const src = img.src || img.getAttribute('src') || ''
          if (dataSrc && (dataSrc.includes('http') || dataSrc.startsWith('//'))) {
            thumbnail = dataSrc
          } else if (src && !src.includes('blank') && !src.includes('placeholder')) {
            thumbnail = src
          }
          if (thumbnail.startsWith('//')) thumbnail = 'https:' + thumbnail
        }

        // Fallback: Generate thumbnail URL from SpankBang CDN pattern if we have the slug
        if (!thumbnail && slug) {
          // SpankBang uses a pattern like: https://tn.sb-cd.com/pornstars/{slug}.jpg
          thumbnail = `https://tn.sb-cd.com/pornstars/${slug.replace(/\+/g, '_')}.jpg`
        }

        // Try to find stats (views, video count)
        let viewCount = ''
        let videoCount = ''
        const card = link.closest('.model-item, .pornstar-item, .item') || link.parentElement?.parentElement
        if (card) {
          const text = card.textContent || ''
          const viewMatch = text.match(/([\d.]+[KMB]?)?\s*views?/i)
          if (viewMatch && viewMatch[1]) viewCount = viewMatch[1]
          const videoMatch = text.match(/(\d+)\s*videos?/i)
          if (videoMatch) videoCount = videoMatch[1]
        }

        results.push({
          id,
          name: name.slice(0, 100),
          slug,
          thumbnail,
          viewCount,
          videoCount,
          url: 'https://spankbang.party' + href,
        })
      })

      return results
    })

    const result: PaginatedResponse<ModelItem> = {
      items,
      page,
      hasMore: items.length >= 20,
    }

    setCache(cacheKey, result)
    return result

  } finally {
    await browserPage.close()
  }
}

// Scrape channels listing
export async function scrapeChannels(page: number = 1): Promise<PaginatedResponse<ChannelItem>> {
  const cacheKey = `channels_${page}`
  const cached = getCached<PaginatedResponse<ChannelItem>>(cacheKey)
  if (cached) return { ...cached, items: cached.items.map(i => ({ ...i })) }

  const browserPage = await getPage()

  try {
    let url = config.baseUrl + config.paths.channels
    if (page > 1) {
      url += page + '/'
    }
    console.log('[Scraper] Fetching channels URL:', url)
    await browserPage.goto(url, { waitUntil: 'domcontentloaded', timeout: config.timeout.navigation })
    await browserPage.waitForSelector('a[href*="/channel/"]', { timeout: config.timeout.scrape }).catch(() => { })

    // Extract channels - thumbnails come from data-src, no scrolling needed
    const items: ChannelItem[] = await browserPage.evaluate(() => {
      const results: Array<{ id: string, name: string, slug: string, thumbnail: string, url: string }> = []
      const seen = new Set<string>()

      // Find channel cards - look for links to channel pages
      document.querySelectorAll('a[href*="/channel/"]').forEach((link) => {
        const href = link.getAttribute('href') || ''
        // Match pattern: /{id}/channel/{slug}/
        const match = href.match(/^\/([a-z0-9]+)\/channel\/([^/]+)/i)
        if (!match) return

        const id = match[1]
        if (seen.has(id)) return
        seen.add(id)

        const slug = match[2]

        // Get name from link text or title
        let name = link.getAttribute('title') || link.textContent?.trim() || ''
        name = name.replace(/[+_]/g, ' ').trim()
        if (!name || name.length < 2) return

        // Find thumbnail - look in the link itself first, then parent containers
        let thumbnail = ''

        // Method 1: Check if the link itself contains an image
        let img = link.querySelector('img') as HTMLImageElement | null

        // Method 2: Check parent containers
        if (!img) {
          const card = link.closest('.channel-item, .item, [class*="channel"]') ||
            link.parentElement?.parentElement
          if (card) {
            img = card.querySelector('img') as HTMLImageElement | null
          }
        }

        // Method 3: Check siblings
        if (!img && link.parentElement) {
          img = link.parentElement.querySelector('img') as HTMLImageElement | null
        }

        if (img) {
          const dataSrc = img.getAttribute('data-src') || ''
          const src = img.src || img.getAttribute('src') || ''
          if (dataSrc && (dataSrc.includes('http') || dataSrc.startsWith('//'))) {
            thumbnail = dataSrc
          } else if (src && !src.includes('blank') && !src.includes('placeholder')) {
            thumbnail = src
          }
          if (thumbnail.startsWith('//')) thumbnail = 'https:' + thumbnail
        }

        // Fallback: Generate thumbnail URL from SpankBang CDN pattern
        if (!thumbnail && slug) {
          thumbnail = `https://tn.sb-cd.com/channels/${slug.replace(/\+/g, '_')}.jpg`
        }

        results.push({
          id,
          name: name.slice(0, 100),
          slug,
          thumbnail,
          url: 'https://spankbang.party' + href,
        })
      })

      return results
    })

    const result: PaginatedResponse<ChannelItem> = {
      items,
      page,
      hasMore: items.length >= 20,
    }

    setCache(cacheKey, result)
    return result

  } finally {
    await browserPage.close()
  }
}

// Cleanup browser on process exit - use sync version to avoid async issues
if (typeof process !== 'undefined') {
  const cleanup = () => {
    if (contextInstance) {
      contextInstance.close().catch(() => { })
      contextInstance = null
    }
    if (browserInstance) {
      browserInstance.close().catch(() => { })
      browserInstance = null
    }
  }
  process.on('beforeExit', cleanup)
}
