// Fast Scraper using HTTP fetch + Cheerio (no browser needed)
// This is 5-10x faster than Playwright for simple page scraping

import * as cheerio from 'cheerio'
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

// Enhanced HTTP fetch with browser-like headers to bypass bot detection
async function fetchPage(url: string, retries = 3): Promise<string> {
  console.log('[FastScraper] Fetching:', url)
  const startTime = Date.now()

  // More comprehensive browser-like headers
  const headers: Record<string, string> = {
    'User-Agent': getRandomUserAgent(),
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'max-age=0',
    'Connection': 'keep-alive',
    'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"macOS"',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
    'Referer': 'https://www.google.com/',
    'DNT': '1',
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        headers,
        redirect: 'follow',
      })

      if (response.status === 403) {
        console.log(`[FastScraper] Got 403, attempt ${attempt}/${retries}`)
        if (attempt < retries) {
          // Wait a bit before retry with different user agent
          await new Promise(r => setTimeout(r, 1000 * attempt))
          headers['User-Agent'] = getRandomUserAgent()
          continue
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const html = await response.text()
      console.log(`[FastScraper] Fetched in ${Date.now() - startTime}ms (attempt ${attempt})`)
      return html
    } catch (error) {
      if (attempt === retries) throw error
      console.log(`[FastScraper] Attempt ${attempt} failed, retrying...`)
      await new Promise(r => setTimeout(r, 1000 * attempt))
    }
  }

  throw new Error('All fetch attempts failed')
}

// Extract videos from HTML using Cheerio
function extractVideosFromHtml(html: string): VideoItem[] {
  const $ = cheerio.load(html)
  const items: VideoItem[] = []
  const seen = new Set<string>()

  // Find all video card containers
  $('.video-item, .js-video-item, [data-testid="video-item"]').each((_, card) => {
    const $card = $(card)

    // Find title link inside the card
    const $titleLink = $card.find('a[href*="/video/"][title]').first()
    if (!$titleLink.length) return

    const href = $titleLink.attr('href') || ''
    const idMatch = href.match(/^\/([a-z0-9]+)\/video\//i)
    if (!idMatch) return

    const id = idMatch[1]
    if (seen.has(id)) return
    seen.add(id)

    const title = $titleLink.attr('title') || ''
    if (!title || title.length < 3) return

    // Find thumbnail - prioritize data-src (lazy load) over src
    let thumbnail = ''
    const $img = $card.find('picture img, a.thumb img, a.relative img, a img').first()
    if ($img.length) {
      const dataSrc = $img.attr('data-src') || ''
      const src = $img.attr('src') || ''
      if (dataSrc && dataSrc.includes('http')) {
        thumbnail = dataSrc
      } else if (src && !src.includes('blank') && !src.includes('placeholder') && src.includes('http')) {
        thumbnail = src
      }
      if (thumbnail.startsWith('//')) thumbnail = 'https:' + thumbnail
    }

    // Find duration
    let duration = ''
    const $durationEl = $card.find('[data-testid="video-item-length"]').first()
    if ($durationEl.length) {
      duration = $durationEl.text().trim()
    }
    if (!duration) {
      // Fallback: look for span with time format
      $card.find('a.thumb span, span').each((_, span) => {
        const text = $(span).text().trim()
        if (/^\d+m$|^\d+:\d+$|^\d+:\d+:\d+$/.test(text)) {
          duration = text
        }
      })
    }

    // Check for quality badge
    let quality = 'HD'
    const $hdBadge = $card.find('.hd, [class*="hd"], [class*="4k"]').first()
    if ($hdBadge.length) {
      const text = $hdBadge.text().trim().toUpperCase()
      if (text.includes('4K')) quality = '4K'
    }

    // Channel name
    const channel = $card.find('a.truncate, .uploader a').first().text().trim() || ''

    items.push({
      id,
      title: title.slice(0, 200),
      thumbnail,
      duration,
      views: '',
      quality,
      channel,
      url: config.baseUrl + href,
    })
  })

  return items
}

// Fast video list scraping
export async function scrapeVideoListFast(page: number = 1): Promise<PaginatedResponse<VideoItem>> {
  console.log('[FastScraper] scrapeVideoList called with page:', page)

  const cacheKey = `fast_list_${page}`
  const cached = getCached<PaginatedResponse<VideoItem>>(cacheKey)
  if (cached) {
    console.log('[FastScraper] Returning cached data for page:', page)
    return { ...cached, items: cached.items.map(i => ({ ...i })) }
  }

  // Build URL: /new_videos/ for page 1, /new_videos/{page}/ for other pages
  let url = config.baseUrl + config.paths.listing
  if (page > 1) {
    url += page + '/'
  }

  const html = await fetchPage(url)
  const items = extractVideosFromHtml(html)

  console.log(`[FastScraper] Extracted ${items.length} videos`)

  const result: PaginatedResponse<VideoItem> = {
    items,
    page,
    hasMore: items.length >= 20,
  }

  setCache(cacheKey, result)
  return result
}

// Fast search scraping
export async function scrapeSearchFast(query: string, page: number = 1): Promise<PaginatedResponse<VideoItem>> {
  const cacheKey = `fast_search_${query}_${page}`
  const cached = getCached<PaginatedResponse<VideoItem>>(cacheKey)
  if (cached) return { ...cached, items: cached.items.map(i => ({ ...i })) }

  // Build search URL
  const cleanQuery = query.trim().toLowerCase().replace(/\s+/g, '+')
  let url = config.baseUrl + '/s/' + cleanQuery + '/'
  if (page > 1) {
    url += page + '/'
  }

  console.log('[FastSearch] Query:', query, '-> URL:', url)

  const html = await fetchPage(url)
  const items = extractVideosFromHtml(html)

  const result: PaginatedResponse<VideoItem> = {
    items,
    page,
    hasMore: items.length >= 20,
  }

  setCache(cacheKey, result)
  return result
}

// Fast models scraping
export async function scrapeModelsFast(page: number = 1): Promise<PaginatedResponse<ModelItem>> {
  const cacheKey = `fast_models_${page}`
  const cached = getCached<PaginatedResponse<ModelItem>>(cacheKey)
  if (cached) return { ...cached, items: cached.items.map(i => ({ ...i })) }

  let url = config.baseUrl + config.paths.models
  if (page > 1) {
    url += page + '/'
  }

  const html = await fetchPage(url)
  const $ = cheerio.load(html)
  const items: ModelItem[] = []
  const seen = new Set<string>()

  $('a[href*="/pornstar/"]').each((_, link) => {
    const $link = $(link)
    const href = $link.attr('href') || ''
    const match = href.match(/^\/([a-z0-9]+)\/pornstar\/([^/]+)/i)
    if (!match) return

    const id = match[1]
    if (seen.has(id)) return
    seen.add(id)

    const slug = match[2]
    let name = $link.attr('title') || $link.text().trim() || ''
    name = name.replace(/[+_]/g, ' ').trim()
    if (!name || name.length < 2) return

    // Find thumbnail
    let thumbnail = ''
    const $card = $link.closest('div, article, section')
    if ($card.length) {
      const $img = $card.find('img').first()
      if ($img.length) {
        const dataSrc = $img.attr('data-src') || ''
        const src = $img.attr('src') || ''
        if (dataSrc && dataSrc.includes('http')) {
          thumbnail = dataSrc
        } else if (src && !src.includes('blank') && src.includes('http')) {
          thumbnail = src
        }
        if (thumbnail.startsWith('//')) thumbnail = 'https:' + thumbnail
      }
    }

    items.push({
      id,
      name: name.slice(0, 100),
      slug,
      thumbnail,
      viewCount: '',
      videoCount: '',
      url: config.baseUrl + href,
    })
  })

  const result: PaginatedResponse<ModelItem> = {
    items,
    page,
    hasMore: items.length >= 20,
  }

  setCache(cacheKey, result)
  return result
}

// Fast channels scraping
export async function scrapeChannelsFast(page: number = 1): Promise<PaginatedResponse<ChannelItem>> {
  const cacheKey = `fast_channels_${page}`
  const cached = getCached<PaginatedResponse<ChannelItem>>(cacheKey)
  if (cached) return { ...cached, items: cached.items.map(i => ({ ...i })) }

  let url = config.baseUrl + config.paths.channels
  if (page > 1) {
    url += page + '/'
  }

  const html = await fetchPage(url)
  const $ = cheerio.load(html)
  const items: ChannelItem[] = []
  const seen = new Set<string>()

  $('a[href*="/channel/"]').each((_, link) => {
    const $link = $(link)
    const href = $link.attr('href') || ''
    const match = href.match(/^\/([a-z0-9]+)\/channel\/([^/]+)/i)
    if (!match) return

    const id = match[1]
    if (seen.has(id)) return
    seen.add(id)

    const slug = match[2]
    let name = $link.attr('title') || $link.text().trim() || ''
    name = name.replace(/[+_]/g, ' ').trim()
    if (!name || name.length < 2) return

    // Find thumbnail
    let thumbnail = ''
    const $card = $link.closest('div, article, section')
    if ($card.length) {
      const $img = $card.find('img').first()
      if ($img.length) {
        const dataSrc = $img.attr('data-src') || ''
        const src = $img.attr('src') || ''
        if (dataSrc && dataSrc.includes('http')) {
          thumbnail = dataSrc
        } else if (src && !src.includes('blank') && src.includes('http')) {
          thumbnail = src
        }
        if (thumbnail.startsWith('//')) thumbnail = 'https:' + thumbnail
      }
    }

    items.push({
      id,
      name: name.slice(0, 100),
      slug,
      thumbnail,
      url: config.baseUrl + href,
    })
  })

  const result: PaginatedResponse<ChannelItem> = {
    items,
    page,
    hasMore: items.length >= 20,
  }

  setCache(cacheKey, result)
  return result
}

// Fast video details scraping using cheerio
export async function scrapeVideoDetailsFast(videoId: string): Promise<VideoDetails | null> {
  const cacheKey = `fast_video_${videoId}`
  const cached = getCached<VideoDetails>(cacheKey)
  if (cached) return { ...cached }

  try {
    const url = buildUrl(config.paths.video, { id: videoId })
    console.log('[FastScraper] Fetching video details from:', url)
    const html = await fetchPage(url)
    console.log('[FastScraper] Got HTML, length:', html.length)
    const $ = cheerio.load(html)

    // Basic info
    const title = $('h1').first().text().trim() || $('title').text().split(' - ')[0].trim()
    console.log('[FastScraper] Extracted title:', title || '(empty)')
    if (!title) return null

    const views = $('span.views, .view-count, [class*="views"]').first().text().trim() || ''
    const duration = $('.vjs-duration-display, .duration, [class*="duration"]').first().text().trim() || ''
    const channel = $('.channel-by a, .uploader a, a[href*="/channel/"]').first().text().trim() || ''
    const thumbnail = $('meta[property="og:image"]').attr('content') ||
      $('video').attr('poster') ||
      $('img.poster, .video-poster img').first().attr('src') || ''
    const description = $('meta[name="description"]').attr('content') ||
      $('.description, .video-description').first().text().trim() || ''

    // Categories
    const categories: string[] = []
    $('.searches a[href^="/s/"], .categories a, a[href*="/category/"]').each((_, el) => {
      const text = $(el).text().trim()
      if (text && text.length > 1 && text.length < 50) categories.push(text)
    })

    // Tags
    const tags: string[] = []
    $('.tags-info a, .video-tags a, a[href*="/tag/"]').each((_, el) => {
      const text = $(el).text().trim()
      if (text && text.length > 1 && text.length < 50) tags.push(text)
    })

    // Stream extraction from script tags
    const streams: VideoStream[] = []
    $('script').each((_, script) => {
      const content = $(script).html() || ''

      // Method 1: stream_data object
      const streamMatch = content.match(/stream_data\s*=\s*(\{[\s\S]*?\});/)
      if (streamMatch) {
        try {
          const data = JSON.parse(streamMatch[1].replace(/'/g, '"'))
          Object.entries(data).forEach(([quality, urls]) => {
            if (Array.isArray(urls) && urls[0] && typeof urls[0] === 'string' && urls[0].startsWith('http')) {
              streams.push({
                quality,
                url: urls[0],
                type: urls[0].includes('.m3u8') ? 'm3u8' : 'mp4',
              })
            }
          })
        } catch { }
      }

      // Method 2: Direct URL patterns
      const urlMatches = content.matchAll(/["']?(https?:\/\/[^"'\s]+\.(mp4|m3u8)[^"'\s]*)["']?/gi)
      for (const match of urlMatches) {
        const streamUrl = match[1]
        if (!streams.find(s => s.url === streamUrl)) {
          const qualityMatch = streamUrl.match(/(\d{3,4})p/i)
          streams.push({
            quality: qualityMatch ? `${qualityMatch[1]}p` : 'auto',
            url: streamUrl,
            type: streamUrl.includes('.m3u8') ? 'm3u8' : 'mp4',
          })
        }
      }
    })

    // Filter and sort streams
    const filteredStreams = streams.filter(s => {
      if (s.type === 'm3u8') return false
      const allowedQualities = ['240p', '360p', '480p', '720p', '1080p', '4k', '4K']
      const quality = s.quality.toLowerCase()
      return allowedQualities.some(q => quality === q.toLowerCase() || quality.includes(q.replace('p', '')))
    }).sort((a, b) => {
      const qualityOrder: Record<string, number> = { '4k': 6, '4K': 6, '1080p': 5, '720p': 4, '480p': 3, '360p': 2, '240p': 1 }
      return (qualityOrder[b.quality] || 0) - (qualityOrder[a.quality] || 0)
    })

    const result: VideoDetails = {
      id: videoId,
      title: title.slice(0, 200),
      thumbnail: thumbnail.startsWith('//') ? 'https:' + thumbnail : thumbnail,
      duration,
      views,
      quality: filteredStreams.some(s => s.quality.includes('1080') || s.quality.toLowerCase().includes('4k')) ? '4K' : 'HD',
      channel,
      url: config.baseUrl + `/${videoId}/video/`,
      description,
      categories: [...new Set(categories)].slice(0, 20),
      tags: [...new Set(tags)].slice(0, 30),
      streams: filteredStreams,
    }

    setCache(cacheKey, result)
    return result

  } catch (error) {
    console.error('[FastScraper] Error scraping video details:', error)
    return null
  }
}
