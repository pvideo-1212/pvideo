// Static data module - loads data from JSON files instead of scraping
import dataJson from '../data.json'
import modelsJson from '../models.json'
import sitesJson from '../sites.json'

// Types
export interface VideoItem {
  id: string
  title: string
  thumbnail: string
  previewVideo?: string
  duration: string
  views: string
  rating?: string
  url: string
  videoUrl: string
  models?: string[]
  categories?: string[]
  description?: string
  isHD?: boolean
  videoSources?: {
    src: string
    quality: string
    type: string | null
  }[]
}

export interface Category {
  name: string
  slug: string
  count?: number
  url?: string
  thumbnail?: string
}

export interface Channel {
  name: string
  slug: string
  url: string
  thumbnail?: string | null
  videoCount?: number
  siteUrl?: string
}

export interface Model {
  name: string
  slug: string
  url: string
  modelUrl?: string
  thumbnail?: string | null
  image?: string | null
  videoCount?: number
  videos?: string[]
}

// Transform raw video data to our format
function transformVideo(video: any, index: number): VideoItem {
  const slug = video.videoUrl
    ?.replace('https://www.wow.xxx/videos/', '')
    ?.replace(/\/$/, '') || `video-${index}`
  
  return {
    id: slug,
    title: video.title || 'Untitled',
    thumbnail: video.image || '',
    previewVideo: video.previewVideo,
    duration: video.duration || '',
    views: video.views || '0',
    rating: video.rating,
    url: video.videoUrl || '',
    videoUrl: video.videoUrl || '',
    models: video.models || [],
    categories: video.categories?.filter((c: string) => c !== 'Categories') || [],
    description: video.description,
    isHD: video.isHD,
    videoSources: video.videoSources || []
  }
}

// Get all videos
const allVideos: VideoItem[] = (dataJson as any).videos?.map(transformVideo) || []

// Extract unique categories from video data
function extractCategories(): Category[] {
  const categoryMap = new Map<string, number>()
  
  allVideos.forEach(video => {
    video.categories?.forEach(cat => {
      if (cat && cat !== 'Categories') {
        categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1)
      }
    })
  })
  
  return Array.from(categoryMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      count
    }))
}

// Get all sites/channels
function getSites(): Channel[] {
  return ((sitesJson as any).sites || []).map((site: any) => ({
    name: site.name,
    slug: site.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    url: site.siteUrl,
    siteUrl: site.siteUrl,
    thumbnail: site.image,
    videoCount: site.videoCount
  }))
}

// Get all models/pornstars
function getModels(): Model[] {
  return ((modelsJson as any).models || []).map((model: any) => ({
    name: model.name,
    slug: model.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    url: model.modelUrl,
    modelUrl: model.modelUrl,
    thumbnail: model.image,
    image: model.image,
    videoCount: model.videoCount,
    videos: model.videos || []
  }))
}

// Exported static data
export const staticVideos = allVideos
export const staticCategories = extractCategories()
export const staticChannels = getSites()
export const staticModels = getModels()

// Video filtering and pagination
const VIDEOS_PER_PAGE = 36

export function getVideos(options: {
  category?: string
  channel?: string
  model?: string
  page?: number
  search?: string
}): { videos: VideoItem[]; hasMore: boolean; totalPages: number } {
  let filtered = [...allVideos]
  
  // Filter by category
  if (options.category) {
    const catSlug = options.category.toLowerCase()
    filtered = filtered.filter(v => 
      v.categories?.some(c => 
        c.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === catSlug ||
        c.toLowerCase() === catSlug
      )
    )
  }
  
  // Filter by channel (match against video URL or site name in title)
  if (options.channel) {
    const channelSlug = options.channel.toLowerCase()
    filtered = filtered.filter(v => {
      const urlLower = v.url.toLowerCase()
      const titleLower = v.title.toLowerCase()
      return urlLower.includes(channelSlug) || titleLower.includes(channelSlug.replace(/-/g, ' '))
    })
  }
  
  // Filter by model
  if (options.model) {
    const modelName = options.model.replace(/-/g, ' ').toLowerCase()
    filtered = filtered.filter(v => 
      v.models?.some(m => m.toLowerCase() === modelName)
    )
  }
  
  // Search
  if (options.search) {
    const query = options.search.toLowerCase()
    filtered = filtered.filter(v => 
      v.title.toLowerCase().includes(query) ||
      v.models?.some(m => m.toLowerCase().includes(query)) ||
      v.categories?.some(c => c.toLowerCase().includes(query))
    )
  }
  
  // Pagination
  const page = options.page || 1
  const start = (page - 1) * VIDEOS_PER_PAGE
  const end = start + VIDEOS_PER_PAGE
  const paginatedVideos = filtered.slice(start, end)
  
  return {
    videos: paginatedVideos,
    hasMore: end < filtered.length,
    totalPages: Math.ceil(filtered.length / VIDEOS_PER_PAGE)
  }
}

// Get video by ID (slug)
export function getVideoById(id: string): VideoItem | null {
  return allVideos.find(v => v.id === id) || null
}

// Get video by URL
export function getVideoByUrl(url: string): VideoItem | null {
  return allVideos.find(v => v.url === url || v.videoUrl === url) || null
}

// Search videos
export function searchVideos(query: string, page = 1): { videos: VideoItem[]; hasMore: boolean } {
  return getVideos({ search: query, page })
}
