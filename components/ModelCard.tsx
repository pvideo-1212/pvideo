'use client'

import Link from 'next/link'
import type { ModelItem } from '@/lib/scraper/types'

interface ModelCardProps {
  model: ModelItem
}

export function ModelCard({ model }: ModelCardProps) {
  return (
    <Link
      href={`/models/${model.id}?slug=${model.slug}`}
      className="model-card group relative block overflow-hidden rounded-xl bg-surface-card transition-all duration-300 hover:scale-105 hover:shadow-2xl"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-900">
        {model.thumbnail && !model.thumbnail.includes('blank.png') ? (
          <img
            src={model.thumbnail}
            alt={model.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-purple-600/20 to-pink-600/20">
            <span className="text-4xl text-white/50">👤</span>
          </div>
        )}

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Stats overlay on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 transition-all duration-300 group-hover:opacity-100">
          <div className="flex items-center justify-between text-xs text-white/90">
            {model.viewCount && (
              <span className="flex items-center gap-1">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {model.viewCount}
              </span>
            )}
            {model.videoCount && (
              <span className="flex items-center gap-1">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {model.videoCount} videos
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Name */}
      <div className="p-3">
        <h3 className="truncate text-center text-sm font-medium text-white group-hover:text-purple-400 transition-colors">
          {model.name}
        </h3>
      </div>
    </Link>
  )
}

// Skeleton loader for ModelCard
export function ModelCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl bg-surface-card animate-pulse">
      <div className="aspect-[3/4] w-full bg-gray-800" />
      <div className="p-3">
        <div className="mx-auto h-4 w-3/4 rounded bg-gray-700" />
      </div>
    </div>
  )
}
