'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Play, Clock, Eye, MoreVertical } from 'lucide-react'
import type { VideoItem } from '@/lib/scraper/types'

interface VideoCardProps {
  video: VideoItem
}

export default function VideoCard({ video }: VideoCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="group relative flex flex-col gap-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/video/${video.id}`}
        className="block relative aspect-video rounded-xl overflow-hidden bg-gray-900 group-hover:ring-2 ring-purple-500 transition-all duration-200"
        aria-label={`Watch ${video.title}`}
      >
        {/* Thumbnail Image */}
        {!imgError ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 bg-gray-800 animate-pulse" />
            )}
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              unoptimized // Scraped URLs might not work with Vercel Image Optimization free tier quotas or timeouts
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              className={`object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'} group-hover:scale-105 transition-transform duration-500`}
            />

            {/* Hover Overlay */}
            <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true">
              <Play className="w-12 h-12 text-white fill-white opacity-80" />
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-500" aria-hidden="true">
            <Play className="w-10 h-10" />
          </div>
        )}

        {/* Duration Badge */}
        {video.duration && (
          <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/80 rounded text-[11px] font-bold text-white tracking-wide z-10">
            {video.duration}
          </span>
        )}

        {/* Quality Badge */}
        {video.quality && (
          <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-purple-600 rounded text-[10px] font-bold text-white uppercase tracking-wider shadow-sm z-10">
            {video.quality}
          </span>
        )}
      </Link>

      {/* Meta Info */}
      <div className="flex gap-3 px-1">
        {/* Channel Icon Placeholder */}
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-800 hidden sm:block overflow-hidden" aria-hidden="true">
          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white uppercase">
            {video.channel ? video.channel.charAt(0) : 'T'}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2 group-hover:text-purple-400 transition-colors mb-1">
            <Link href={`/video/${video.id}`} aria-label={`Watch ${video.title}`}>
              {video.title}
            </Link>
          </h3>

          <div className="text-xs text-gray-400 flex flex-col gap-0.5">
            <Link
              href={`/search?q=${encodeURIComponent(video.channel || '')}`}
              className="hover:text-white transition-colors truncate"
              aria-label={`Search for channel ${video.channel || 'TubeX Channel'}`}
            >
              {video.channel || 'TubeX Channel'}
            </Link>

            <div className="flex items-center gap-1" aria-label={`${video.views || 'New views'} • Uploaded Today`}>
              <span>{video.views || 'New'}</span>
              <span aria-hidden="true">•</span>
              <span>Today</span>
            </div>
          </div>
        </div>

        <button
          className="flex-shrink-0 self-start text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="More options"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// Compact Skeleton for denser grid
export function VideoCardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div className="aspect-video bg-gray-800 rounded-xl animate-pulse" />
      <div className="flex gap-3 px-1">
        <div className="w-9 h-9 bg-gray-800 rounded-full flex-shrink-0 animate-pulse hidden sm:block" />
        <div className="flex-1 space-y-2 py-1">
          <div className="h-4 bg-gray-800 rounded w-full animate-pulse" />
          <div className="h-3 bg-gray-800 rounded w-2/3 animate-pulse" />
        </div>
      </div>
    </div>
  )
}
