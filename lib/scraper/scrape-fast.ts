// Fast Scraper using HTTP fetch + Cheerio (no browser needed)
// This is 5-10x faster than Playwright for simple page scraping

import * as cheerio from 'cheerio'
import { config, getRandomUserAgent } from './config'
import type { VideoItem, PaginatedResponse, ModelItem, ChannelItem } from './types'

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

// Fast HTTP fetch with proper headers
async function fetchPage(url: string): Promise<string> {
  console.log('[FastScraper] Fetching:', url)
  const startTime = Date.now()

  const response = await fetch(url, {
    headers: {
      'User-Agent': getRandomUserAgent(),
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Cache-Control': 'max-age=0',
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  const html = await response.text()
  console.log(`[FastScraper] Fetched in ${Date.now() - startTime}ms`)
  return html
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
