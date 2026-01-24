'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Eye, Clock, User, Tag, ThumbsUp, Share2, Play } from 'lucide-react'
import Header from '@/components/Header'
import VideoPlayer from '@/components/VideoPlayer'
import { LeaderboardAd, SidebarAd, InContentAd } from '@/components/ad-banner'
import type { VideoDetails, VideoItem } from '@/lib/scraper/types'

interface VideoClientProps {
  initialVideo: VideoDetails
}

export default function VideoClient({ initialVideo }: VideoClientProps) {
  const [video] = useState<VideoDetails>(initialVideo)
  const [relatedVideos, setRelatedVideos] = useState<VideoItem[]>([])
  const [loadingRelated, setLoadingRelated] = useState(false)

  // Fetch Related Videos
  useEffect(() => {
    const fetchRelated = async () => {
      // Use the first category, or first tag, or just 'trending' fallback
      const searchTerm = video.categories?.[0] || video.tags?.[0] || 'trending'

      setLoadingRelated(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`)
        const data = await res.json()

        if (data.success && data.items) {
          // Filter out current video and limit to 10
          const filtered = data.items
            .filter((v: VideoItem) => v.id !== video.id)
            .slice(0, 10)
          setRelatedVideos(filtered)
        }
      } catch (err) {
        console.error('Related videos fetch error:', err)
      } finally {
        setLoadingRelated(false)
      }
    }

    fetchRelated()
  }, [video])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <LeaderboardAd />

      <main className="flex-1 container mx-auto px-4 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors lg:hidden"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8">

          {/* Main Content Column (Video & Info) */}
          <div className="lg:col-span-2 xl:col-span-3">
            {/* Extended Player Container */}
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl mb-6 border border-white/5">
              <VideoPlayer
                streams={video.streams}
                thumbnail={video.thumbnail}
                title={video.title}
              />
            </div>

            {/* Video Info Card */}
            <div className="glass rounded-2xl p-6 mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">{video.title}</h1>

              {/* Stats Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/5 mb-6">
                <div className="flex flex-wrap items-center gap-6 text-gray-400">
                  {video.views && (
                    <span className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-gray-500" />
                      {video.views} views
                    </span>
                  )}
                  {video.duration && (
                    <span className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-gray-500" />
                      {video.duration}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-sm font-medium">
                    <ThumbsUp className="w-4 h-4" />
                    Like
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-sm font-medium">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>

              {/* Channel & Description */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <Link href={`/search?q=${encodeURIComponent(video.channel || '')}`} className="text-lg font-semibold text-white hover:text-purple-400 transition-colors">
                    {video.channel || 'Unknown Channel'}
                  </Link>
                  <p className="text-sm text-gray-500 mb-3">Verified Upload</p>

                  {video.description && (
                    <div className="text-gray-300 text-sm leading-relaxed bg-white/5 rounded-xl p-4">
                      {video.description}
                    </div>
                  )}
                </div>
              </div>

              {/* Categories & Tags */}
              <div className="space-y-4">
                {video.categories && video.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {video.categories.map((cat, index) => (
                      <Link
                        key={index}
                        href={`/search?q=${encodeURIComponent(cat)}`}
                        className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg text-xs font-medium text-purple-300 hover:bg-purple-500/20 transition-colors"
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                )}

                {video.tags && video.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {video.tags.slice(0, 15).map((tag, index) => (
                      <Link
                        key={index}
                        href={`/search?q=${encodeURIComponent(tag)}`}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Ad (visible only on small screens) */}
            <div className="block lg:hidden mb-8">
              <InContentAd />
            </div>

            {/* Comments Placeholder */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-6">Comments</h3>
              <div className="text-center py-10 bg-white/5 rounded-xl border border-white/5 border-dashed">
                <p className="text-gray-400">Comments are disabled for this video.</p>
              </div>
            </div>
          </div>

          {/* Sidebar Column (Related Videos & Ads) */}
          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Play className="w-4 h-4 text-purple-400 fill-purple-400" />
              Up Next
            </h3>

            {/* Sidebar Ad Top */}
            <SidebarAd />

            {/* Related Videos List */}
            <div className="space-y-4">
              {loadingRelated ? (
                // Skeleton loading for related videos
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-40 h-24 bg-white/10 rounded-lg shrink-0" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-white/10 rounded w-full" />
                      <div className="h-3 bg-white/10 rounded w-2/3" />
                    </div>
                  </div>
                ))
              ) : (
                relatedVideos.map((related, index) => (
                  <div key={related.id}>
                    {/* Inject Ad after 3rd item */}
                    {index === 3 && <SidebarAd className="mb-4" />}

                    <Link href={`/video/${related.id}`} className="group flex gap-3">
                      {/* Thumbnail Small */}
                      <div className="relative w-40 aspect-video rounded-lg overflow-hidden bg-black shrink-0 border border-white/10 group-hover:border-purple-500/50 transition-colors">
                        <img
                          src={related.thumbnail}
                          alt={related.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/80 rounded text-[10px] font-bold text-white">
                          {related.duration}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 py-1">
                        <h4 className="text-sm font-medium text-white line-clamp-2 group-hover:text-purple-400 transition-colors mb-1">
                          {related.title}
                        </h4>
                        <p className="text-xs text-gray-500 truncate mb-1">
                          {related.channel || 'Suggested'}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-gray-500">
                          {related.quality && (
                            <span className="px-1.5 py-0.5 bg-white/10 rounded text-gray-300">
                              {related.quality}
                            </span>
                          )}
                          <span>•</span>
                          <span>{related.views || 'New'}</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              )}

              {!loadingRelated && relatedVideos.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  No related videos found
                </div>
              )}
            </div>

            {/* Sidebar Ad Bottom */}
            <div className="sticky top-24">
              <SidebarAd />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
