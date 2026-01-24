'use client'

import VideoCard, { VideoCardSkeleton } from './VideoCard'
import type { VideoItem } from '@/lib/scraper/types'

interface VideoGridProps {
  videos: VideoItem[]
  loading?: boolean
  skeletonCount?: number
}

export default function VideoGrid({ videos, loading = false, skeletonCount = 12 }: VideoGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <VideoCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-lg">No videos found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  )
}
