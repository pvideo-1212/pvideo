'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Play, Eye, Clock, Tv, ExternalLink } from 'lucide-react'
import Header from '@/components/Header'
import VideoCard, { VideoCardSkeleton } from '@/components/VideoCard'
import { LeaderboardAd, FooterAd } from '@/components/ad-banner'
import type { VideoItem } from '@/lib/scraper/types'

interface ChannelClientProps {
  channelName: string
  channelId: string
  channelSlug: string
  initialVideos: VideoItem[]
}

export default function ChannelClient({ channelName, channelId, channelSlug, initialVideos }: ChannelClientProps) {
  const [videos] = useState<VideoItem[]>(initialVideos)
  // We can add client-side loading for "load more" later
  const loading = false
  const error = null

  // Generate channel thumbnail URL
  const channelThumbnail = `https://spankbang.com/avatar/250/channel_${channelId}.jpg`

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <LeaderboardAd />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/channels"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Channels
        </Link>

        {/* Channel Profile Card */}
        <div className="glass rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 via-blue-600/10 to-transparent" />

          {/* Banner background effect */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-cyan-500/10 to-transparent" />

          <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Channel Logo */}
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden ring-4 ring-cyan-500/50 shadow-2xl shadow-cyan-500/20 bg-gray-800">
                <img
                  src={channelThumbnail}
                  alt={channelName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(channelName)}&size=300&background=0891b2&color=fff`
                  }}
                />
              </div>
              <div className="absolute -bottom-3 -right-3 p-3 bg-gradient-to-r from-cyan-600 to-blue-500 rounded-xl shadow-lg shadow-cyan-500/50">
                <Tv className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Channel Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    {channelName}
                  </span>
                </h1>
                <span className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded-full text-cyan-400 text-xs font-medium">
                  Verified Studio
                </span>
              </div>

              <p className="text-gray-400 mb-4">
                Official channel for {channelName}. Watch the latest HD videos.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                  <Play className="w-5 h-5 text-cyan-400" />
                  <span className="text-white font-medium">{videos.length}+ Videos</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                  <Eye className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">HD Quality</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                  <Clock className="w-5 h-5 text-teal-400" />
                  <span className="text-white font-medium">Daily Updates</span>
                </div>
              </div>

              {/* Visit Channel */}
              <a
                href={`https://spankbang.party/${channelId}/channel/${channelSlug}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-500 hover:to-blue-400 rounded-lg font-medium text-white transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
              >
                View Full Channel
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Videos Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Play className="w-6 h-6 text-cyan-400" />
            Videos from {channelName}
          </h2>

          {/* Videos Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-y-8">
            {videos.length > 0 ? (
              videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))
            ) : (
              <div className="col-span-full py-16 text-center text-gray-400 glass rounded-xl">
                <p className="text-lg mb-4">No videos found for {channelName}</p>
                <Link
                  href="/channels"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Browse other channels
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
