// Video Store - File-based storage for tracked videos
// Used for dynamic sitemap generation and SEO keyword extraction

import fs from 'fs'
import path from 'path'

export interface TrackedVideo {
  id: string
  title: string
  thumbnail: string
  duration?: string
  views?: string
  rating?: string
  categories?: string[]
  keywords: string[]
  trackedAt: string
}

interface VideoStoreData {
  videos: TrackedVideo[]
  keywords: string[]
  lastUpdated: string
}

// Store path - use .next/cache for persistence across deployments
const STORE_PATH = path.join(process.cwd(), '.next', 'cache', 'video-store.json')
const MAX_VIDEOS = 10000 // Maximum videos to track
const MAX_KEYWORDS = 5000 // Maximum keywords to store

// Ensure directory exists
function ensureDir() {
  const dir = path.dirname(STORE_PATH)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

// Load store from file
function loadStore(): VideoStoreData {
  try {
    ensureDir()
    if (fs.existsSync(STORE_PATH)) {
      const data = fs.readFileSync(STORE_PATH, 'utf-8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('[VideoStore] Error loading store:', error)
  }
  return { videos: [], keywords: [], lastUpdated: new Date().toISOString() }
}

// Save store to file
function saveStore(data: VideoStoreData) {
  try {
    ensureDir()
    fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('[VideoStore] Error saving store:', error)
  }
}

// Extract keywords from video title and categories
function extractKeywords(video: { title?: string; categories?: string[] }): string[] {
  const keywords = new Set<string>()

  // Extract from title
  if (video.title) {
    // Clean and split title
    const words = video.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2)

    words.forEach(w => keywords.add(w))

    // Also add 2-word phrases
    for (let i = 0; i < words.length - 1; i++) {
      keywords.add(`${words[i]} ${words[i + 1]}`)
    }
  }

  // Add categories as keywords
  if (video.categories) {
    video.categories.forEach(cat => {
      keywords.add(cat.toLowerCase())
      // Also add with "porn" suffix
      keywords.add(`${cat.toLowerCase()} porn`)
      keywords.add(`${cat.toLowerCase()} videos`)
    })
  }

  return Array.from(keywords)
}

// Track a video play
export async function trackVideo(video: {
  id: string
  title: string
  thumbnail?: string
  duration?: string
  views?: string
  rating?: string
  categories?: string[]
}): Promise<boolean> {
  try {
    const store = loadStore()

    // Check if video already tracked
    const existingIndex = store.videos.findIndex(v => v.id === video.id)

    // Extract keywords
    const keywords = extractKeywords(video)

    const trackedVideo: TrackedVideo = {
      id: video.id,
      title: video.title,
      thumbnail: video.thumbnail || '',
      duration: video.duration,
      views: video.views,
      rating: video.rating,
      categories: video.categories,
      keywords,
      trackedAt: new Date().toISOString()
    }

    if (existingIndex !== -1) {
      // Update existing video (move to front)
      store.videos.splice(existingIndex, 1)
    }

    // Add to front (most recent first)
    store.videos.unshift(trackedVideo)

    // Trim to max size
    if (store.videos.length > MAX_VIDEOS) {
      store.videos = store.videos.slice(0, MAX_VIDEOS)
    }

    // Update keyword list
    const allKeywords = new Set(store.keywords)
    keywords.forEach(k => allKeywords.add(k))

    // Convert to array and trim
    store.keywords = Array.from(allKeywords).slice(0, MAX_KEYWORDS)
    store.lastUpdated = new Date().toISOString()

    saveStore(store)
    console.log(`[VideoStore] Tracked video: ${video.id} - ${video.title?.substring(0, 50)}`)
    return true
  } catch (error) {
    console.error('[VideoStore] Error tracking video:', error)
    return false
  }
}

// Get tracked videos for sitemap (paginated)
export function getTrackedVideos(page: number = 1, perPage: number = 200): TrackedVideo[] {
  const store = loadStore()
  const start = (page - 1) * perPage
  const end = start + perPage
  return store.videos.slice(start, end)
}

// Get total tracked video count
export function getTrackedVideoCount(): number {
  const store = loadStore()
  return store.videos.length
}

// Get all tracked keywords for SEO
export function getTrackedKeywords(): string[] {
  const store = loadStore()
  return store.keywords
}

// Get store stats
export function getStoreStats(): { videoCount: number; keywordCount: number; lastUpdated: string } {
  const store = loadStore()
  return {
    videoCount: store.videos.length,
    keywordCount: store.keywords.length,
    lastUpdated: store.lastUpdated
  }
}

// Clear store (for testing/maintenance)
export function clearStore() {
  saveStore({ videos: [], keywords: [], lastUpdated: new Date().toISOString() })
}
