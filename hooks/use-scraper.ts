"use client"

import { useState, useEffect, useRef } from 'react'
import sitesJson from '../sites.json'
import modelsJson from '../models.json'

// Types
export interface VideoItem {
  id: string
  title: string
  thumbnail: string
  thumbs?: string[]
  duration: string
  durationSec?: number
  views: string
  viewsCount?: number
  rating?: string
  url: string
  embedUrl?: string
  categories?: string[]
  keywords?: string
  addedDate?: string
}

export interface Category {
  name: string
  slug: string
  count?: number
}

export interface Channel {
  name: string
  slug: string
  url?: string
  thumbnail?: string | null
  videoCount?: number
}

export interface Model {
  name: string
  slug: string
  url?: string
  thumbnail?: string | null
  image?: string | null
  videoCount?: number
}

interface State<T> {
  data: T | null
  loading: boolean
  error: string | null
}

// Cache for faster loads
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

function getCached(key: string) {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  return null
}

function setCache(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() })
}

// Fetch videos from our server API (server fetches from eporner)
async function fetchVideos(query: string, page: number, order: string) {
  const cacheKey = `videos-${query}-${page}-${order}`
  const cached = getCached(cacheKey)
  if (cached) return cached

  try {
    const params = new URLSearchParams({ query, page: String(page), per_page: '24', order })
    const response = await fetch(`/api/eporner/videos?${params}`)
    const data = await response.json()

    if (data.success && data.videos?.length > 0) {
      const result = {
        videos: data.videos,
        hasMore: data.page < data.totalPages,
        totalPages: data.totalPages || 1,
        totalCount: data.totalCount || 0
      }
      setCache(cacheKey, result)
      console.log('[API] Loaded', result.videos.length, 'videos for:', query)
      return result
    }
  } catch (e) {
    console.error('[API] Fetch error:', e)
  }
  return null
}

// Fetch video details from our server API
async function fetchVideoDetails(id: string) {
  const cacheKey = `video-${id}`
  const cached = getCached(cacheKey)
  if (cached) return cached

  try {
    const response = await fetch(`/api/eporner/video/${id}`)
    const result = await response.json()

    if (result.success && result.data) {
      setCache(cacheKey, result.data)
      console.log('[API] Loaded video:', result.data.title)
      return result.data
    }
  } catch (e) {
    console.error('[API] Video fetch error:', e)
  }
  return null
}

// Prefetch next page in background
function prefetchNextPage(query: string, currentPage: number, order: string) {
  const nextPage = currentPage + 1
  const cacheKey = `videos-${query}-${nextPage}-${order}`
  if (!getCached(cacheKey)) {
    fetchVideos(query, nextPage, order)
  }
}

// Static data from JSON files
const staticChannels: Channel[] = ((sitesJson as any).sites || []).map((site: any) => ({
  name: site.name,
  slug: site.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
  url: site.siteUrl,
  thumbnail: site.image,
  videoCount: site.videoCount
}))

const staticModels: Model[] = ((modelsJson as any).models || []).map((model: any) => ({
  name: model.name,
  slug: model.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
  url: model.modelUrl,
  thumbnail: model.image,
  image: model.image,
  videoCount: model.videoCount
}))

const popularCategories: Category[] = [
  { name: 'Indian', slug: 'indian' },
  { name: 'Japanese', slug: 'japanese' },
  { name: 'Asian', slug: 'asian' },
  { name: 'MILF', slug: 'milf' },
  { name: 'Teen', slug: 'teen' },
  { name: 'Big Tits', slug: 'big-tits' },
  { name: 'Amateur', slug: 'amateur' },
  { name: 'Anal', slug: 'anal' },
  { name: 'Lesbian', slug: 'lesbian' },
  { name: 'Blonde', slug: 'blonde' },
  { name: 'Brunette', slug: 'brunette' },
  { name: 'Hardcore', slug: 'hardcore' },
  { name: 'Creampie', slug: 'creampie' },
  { name: 'POV', slug: 'pov' },
  { name: 'Blowjob', slug: 'blowjob' },
  { name: 'Big Ass', slug: 'big-ass' },
  { name: 'Threesome', slug: 'threesome' },
  { name: 'Massage', slug: 'massage' },
  { name: 'Interracial', slug: 'interracial' },
  { name: 'Cumshot', slug: 'cumshot' },
]

export function useCategories() {
  return { data: popularCategories, loading: false, error: null }
}

export function useChannels() {
  return { data: staticChannels, loading: false, error: null }
}

export function usePornstars() {
  return { data: staticModels, loading: false, error: null }
}

interface VideosState {
  videos: VideoItem[]
  hasMore: boolean
  totalPages: number
  totalCount: number
}

// Hook for fetching videos via server API
export function useVideos(
  category?: string,
  channel?: string,
  model?: string,
  page = 1,
  order = 'top-weekly'
) {
  const [state, setState] = useState<State<VideosState>>({
    data: null, loading: true, error: null
  })

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      let query = 'all'
      if (category) query = category.replace(/-/g, ' ')
      else if (channel) query = channel.replace(/-/g, ' ')
      else if (model) query = model.replace(/-/g, ' ')

      // Check cache first
      const cacheKey = `videos-${query}-${page}-${order}`
      const cached = getCached(cacheKey)

      if (cached) {
        setState({ data: cached, loading: false, error: null })
        prefetchNextPage(query, page, order)
        return
      }

      setState(p => ({ ...p, loading: true }))

      const result = await fetchVideos(query, page, order)

      if (cancelled) return

      if (result) {
        setState({ data: result, loading: false, error: null })
        prefetchNextPage(query, page, order)
      } else {
        setState({
          data: { videos: [], hasMore: false, totalPages: 0, totalCount: 0 },
          loading: false,
          error: 'Failed to load videos'
        })
      }
    }

    load()
    return () => { cancelled = true }
  }, [category, channel, model, page, order])

  return state
}

// Hook for search
export function useSearch(q: string, page = 1) {
  const [state, setState] = useState<State<{ videos: VideoItem[]; hasMore: boolean; totalPages: number }>>({
    data: null, loading: false, error: null
  })
  const ref = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    if (!q.trim()) {
      setState({ data: null, loading: false, error: null })
      return
    }

    if (ref.current) clearTimeout(ref.current)
    ref.current = setTimeout(async () => {
      const cacheKey = `search-${q}-${page}`
      const cached = getCached(cacheKey)

      if (cached) {
        setState({ data: cached, loading: false, error: null })
        return
      }

      setState(p => ({ ...p, loading: true }))

      const result = await fetchVideos(q, page, 'top-weekly')

      if (result) {
        const searchResult = { videos: result.videos, hasMore: result.hasMore, totalPages: result.totalPages }
        setCache(cacheKey, searchResult)
        setState({ data: searchResult, loading: false, error: null })
      } else {
        setState({
          data: { videos: [], hasMore: false, totalPages: 0 },
          loading: false,
          error: 'Search failed'
        })
      }
    }, 400)

    return () => { if (ref.current) clearTimeout(ref.current) }
  }, [q, page])

  return state
}

// Hook for video details via server API
export function useVideoDetail(id: string) {
  const [state, setState] = useState<State<VideoItem | null>>({
    data: null, loading: true, error: null
  })

  useEffect(() => {
    if (!id) {
      setState({ data: null, loading: false, error: 'No video ID' })
      return
    }

    let cancelled = false

    const load = async () => {
      // Check cache first
      const cacheKey = `video-${id}`
      const cached = getCached(cacheKey)

      if (cached) {
        setState({ data: cached, loading: false, error: null })
        return
      }

      const video = await fetchVideoDetails(id)

      if (cancelled) return

      if (video) {
        setState({ data: video, loading: false, error: null })
      } else {
        // Return fallback for embed
        setState({
          data: {
            id,
            title: id.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            thumbnail: '',
            thumbs: [],
            duration: '',
            views: '0',
            rating: '0',
            url: `https://www.eporner.com/video-${id}/`,
            embedUrl: `https://www.eporner.com/embed/${id}/`,
            categories: [],
          },
          loading: false,
          error: null
        })
      }
    }

    load()
    return () => { cancelled = true }
  }, [id])

  return state
}

// Hook for recommended videos - dynamic with random ordering
export function useRecommendedVideos(currentVideoId: string, categories?: string[]) {
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRecommended = async () => {
      setLoading(true)

      try {
        // Use first category or try different popular categories
        const fallbackCategories = ['trending', 'popular', 'new', 'top']
        const category = categories?.[0] || fallbackCategories[Math.floor(Math.random() * fallbackCategories.length)]

        // Randomize page and order for variety
        const orders = ['top-weekly', 'top-monthly', 'latest', 'most-popular']
        const randomOrder = orders[Math.floor(Math.random() * orders.length)]
        const randomPage = Math.floor(Math.random() * 5) + 1 // Pages 1-5

        const result = await fetchVideos(category, randomPage, randomOrder)

        if (result?.videos) {
          // Filter out current video and shuffle
          const filtered = result.videos
            .filter((v: VideoItem) => v?.id && v.id !== currentVideoId)
            .sort(() => Math.random() - 0.5) // Shuffle
            .slice(0, 12)
          setVideos(filtered)
        } else {
          setVideos([])
        }
      } catch (error) {
        console.error('[Recommended] Error loading:', error)
        setVideos([])
      }

      setLoading(false)
    }

    if (currentVideoId) {
      loadRecommended()
    }
  }, [currentVideoId, categories])

  return { videos, loading }
}

// Prefetch helpers
export function usePrefetch() { }
export function prefetchCategory(slug: string) {
  const query = slug.replace(/-/g, ' ')
  fetchVideos(query, 1, 'top-weekly')
}
export function prefetchChannel(s: string) { prefetchCategory(s) }
export function prefetchModel(s: string) { prefetchCategory(s) }

export { staticChannels, staticModels, popularCategories }
