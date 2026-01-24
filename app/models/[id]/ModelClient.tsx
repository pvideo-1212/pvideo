'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Play, Eye, Star } from 'lucide-react'
import Header from '@/components/Header'
import VideoCard, { VideoCardSkeleton } from '@/components/VideoCard'
import { LeaderboardAd, FooterAd } from '@/components/ad-banner'
import type { VideoItem } from '@/lib/scraper/types'

interface ModelClientProps {
  modelName: string
  modelId: string
  modelSlug: string
  initialVideos: VideoItem[]
}

export default function ModelClient({ modelName, modelId, modelSlug, initialVideos }: ModelClientProps) {
  const [videos] = useState<VideoItem[]>(initialVideos)
  // We can add client-side loading for "load more" later, but for now we display initial server data
  const loading = false
  const error = null

  // Generate model thumbnail URL
  const modelThumbnail = `https://spankbang.com/pornstarimg/f/${modelId}-150.jpg`

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <LeaderboardAd />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/models"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Models
        </Link>

        {/* Model Profile Card */}
        <div className="glass rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/10 to-transparent" />

          <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Image */}
            <div className="relative group">
              <div className="w-40 h-52 md:w-48 md:h-64 rounded-xl overflow-hidden ring-4 ring-purple-500/50 shadow-2xl shadow-purple-500/20">
                <img
                  src={modelThumbnail}
                  alt={modelName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(modelName)}&size=300&background=9333ea&color=fff`
                  }}
                />
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full shadow-lg shadow-purple-500/50">
                <Star className="w-4 h-4 text-yellow-300 inline mr-1" fill="currentColor" />
                <span className="text-sm font-bold text-white">Top Model</span>
              </div>
            </div>

            {/* Model Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                  {modelName}
                </span>
              </h1>

              <p className="text-gray-400 mb-4">
                Watch all videos featuring {modelName}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                  <Play className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-medium">{videos.length}+ Videos</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                  <Eye className="w-5 h-5 text-pink-400" />
                  <span className="text-white font-medium">Popular</span>
                </div>
              </div>

              {/* Search on site */}
              <a
                href={`https://spankbang.party/${modelId}/pornstar/${modelSlug}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 rounded-lg font-medium text-white transition-all shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40"
              >
                View Full Profile
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </a>
            </div>
          </div>
        </div>

        {/* Videos Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Play className="w-6 h-6 text-purple-400" />
            Videos featuring {modelName}
          </h2>

          {/* Videos Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-y-8">
            {videos.length > 0 ? (
              videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))
            ) : (
              <div className="col-span-full py-16 text-center text-gray-400 glass rounded-xl">
                <p className="text-lg mb-4">No videos found for {modelName}</p>
                <Link
                  href="/models"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Browse other models
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      <FooterAd />
    </div>
  )
}
