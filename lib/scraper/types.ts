// Scraper Type Definitions

export interface VideoStream {
  quality: string       // "240p", "480p", "720p", "1080p", "4K"
  url: string           // Direct stream URL
  type: 'mp4' | 'm3u8'  // Stream format
}

export interface VideoItem {
  id: string            // Video ID (e.g., "a3uyz")
  title: string         // Video title (max 200 chars)
  thumbnail: string     // Thumbnail image URL
  duration: string      // Duration (e.g., "14m", "1:23:45")
  views: string         // View count (e.g., "1.2M")
  quality: string       // Quality badge ("HD", "4K")
  channel: string       // Channel/uploader name
  url: string           // Full video page URL
}

export interface VideoDetails extends VideoItem {
  description: string   // Video description
  categories: string[]  // Category tags
  tags: string[]        // Keyword tags
  streams: VideoStream[] // Available stream qualities
}

export interface ScraperResponse<T> {
  success: boolean
  data: T | null
  error?: string
  cached?: boolean
}

export interface PaginatedResponse<T> {
  items: T[]
  page: number
  hasMore: boolean
  total?: number
}

// Model/Pornstar types
export interface ModelItem {
  id: string            // Model ID (e.g., "3m")
  name: string          // Model name
  slug: string          // URL slug (e.g., "india+summer")
  thumbnail: string     // Profile/thumbnail image
  viewCount: string     // Total views (e.g., "1.2M")
  videoCount: string    // Number of videos
  url: string           // Full model page URL
}

export interface ModelDetails extends ModelItem {
  description?: string
  videos: VideoItem[]   // Videos by this model
}

// Channel types
export interface ChannelItem {
  id: string            // Channel ID (e.g., "dh")
  name: string          // Channel name  
  slug: string          // URL slug
  thumbnail: string     // Channel logo/thumbnail
  url: string           // Full channel page URL
}

export interface ChannelDetails extends ChannelItem {
  description?: string
  videos: VideoItem[]   // Videos from this channel
}
