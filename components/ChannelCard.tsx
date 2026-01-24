'use client'

import Link from 'next/link'
import type { ChannelItem } from '@/lib/scraper/types'

interface ChannelCardProps {
  channel: ChannelItem
}

export function ChannelCard({ channel }: ChannelCardProps) {
  return (
    <Link
      href={`/channels/${channel.id}?slug=${channel.slug}`}
      className="channel-card group relative block overflow-hidden rounded-xl bg-surface-card transition-all duration-300 hover:scale-105 hover:shadow-2xl"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-900">
        {channel.thumbnail && !channel.thumbnail.includes('blank.png') ? (
          <img
            src={channel.thumbnail}
            alt={channel.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-blue-600/20 to-cyan-600/20">
            <span className="text-4xl text-white/50">📺</span>
          </div>
        )}

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Name */}
      <div className="p-4">
        <h3 className="truncate text-center text-base font-semibold text-white group-hover:text-cyan-400 transition-colors">
          {channel.name}
        </h3>
      </div>
    </Link>
  )
}

// Skeleton loader for ChannelCard
export function ChannelCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl bg-surface-card animate-pulse">
      <div className="aspect-video w-full bg-gray-800" />
      <div className="p-4">
        <div className="mx-auto h-5 w-3/4 rounded bg-gray-700" />
      </div>
    </div>
  )
}
