"use client"

import { useState, Suspense } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import { useVideoDetail, useRecommendedVideos } from '@/hooks/use-scraper'
import { Loader2, Play, Eye, ThumbsUp, Share2, Film, Calendar, Tag, Home, ExternalLink, Star, Clock } from 'lucide-react'

// Related video card with native img
function RelatedVideoCard({ video }: { video: any }) {
  const [imgLoaded, setImgLoaded] = useState(false)

  return (
    <Link href={`/watch/${video.id}`} className="flex gap-3 group">
      <div className="relative w-40 h-24 rounded-lg overflow-hidden shrink-0 bg-[#2c2c2c]">
        {video.thumbnail ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-[#2c2c2c] to-[#1a1a1a] animate-pulse" />
            )}
            <img
              src={video.thumbnail}
              alt=""
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Play className="w-6 h-6 text-gray-600" />
          </div>
        )}
        {video.duration && (
          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 rounded text-xs text-white">
            {video.duration}
          </span>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-[#FF9000] flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all">
            <Play className="w-5 h-5 text-black fill-black ml-0.5" />
          </div>
        </div>
      </div>
      <div className="flex-1 min-w-0 py-1">
        <h4 className="text-sm text-white font-medium group-hover:text-[#FF9000] line-clamp-2 transition-colors">
          {video.title}
        </h4>
        <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
          {video.views && <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{video.views}</span>}
          {video.rating && parseFloat(video.rating) > 0 && (
            <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />{video.rating}</span>
          )}
        </div>
      </div>
    </Link>
  )
}

// Loading skeleton for video player
function VideoPlayerSkeleton() {
  return (
    <div className="bg-black rounded-xl overflow-hidden shadow-2xl animate-pulse">
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-[#FF9000]" />
            <p className="text-gray-400 text-sm">Loading video...</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Loading skeleton for related videos
function RelatedVideosSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex gap-3 animate-pulse">
          <div className="w-40 h-24 rounded-lg bg-[#2c2c2c]" />
          <div className="flex-1 py-1 space-y-2">
            <div className="h-4 bg-[#2c2c2c] rounded w-full" />
            <div className="h-4 bg-[#2c2c2c] rounded w-3/4" />
            <div className="h-3 bg-[#2c2c2c] rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

function WatchContent() {
  const params = useParams()
  const id = params.id as string

  const { data: videoData, loading: isLoading, error } = useVideoDetail(id)
  const { videos: recommendedVideos, loading: recommendedLoading } = useRecommendedVideos(
    id,
    videoData?.categories
  )

  const [liked, setLiked] = useState(false)

  // Loading state with skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d0d0d]">
        <SiteHeader showSearch={false} />
        <main className="max-w-[1600px] mx-auto px-4 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 min-w-0 space-y-4">
              <VideoPlayerSkeleton />
              <div className="bg-[#1b1b1b] rounded-xl border border-[#2c2c2c] p-4 sm:p-5 animate-pulse">
                <div className="h-6 bg-[#2c2c2c] rounded w-3/4 mb-4" />
                <div className="flex gap-4 mb-4">
                  <div className="h-4 bg-[#2c2c2c] rounded w-24" />
                  <div className="h-4 bg-[#2c2c2c] rounded w-20" />
                </div>
              </div>
            </div>
            <aside className="hidden lg:block w-[400px] shrink-0">
              <div className="bg-[#1b1b1b] rounded-xl border border-[#2c2c2c] p-4">
                <div className="h-5 bg-[#2c2c2c] rounded w-1/2 mb-4" />
                <RelatedVideosSkeleton />
              </div>
            </aside>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  // Error state
  if (error || !videoData) {
    return (
      <div className="min-h-screen bg-[#0d0d0d]">
        <SiteHeader showSearch={false} />
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Video Not Found</h2>
            <p className="text-gray-400 mb-6">{error || 'This video may have been removed.'}</p>
            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF9000] text-black font-bold rounded-lg hover:bg-[#FF9000]/90 transition-colors">
              <Home className="w-5 h-5" />Browse Videos
            </Link>
          </div>
        </div>
        <SiteFooter />
      </div>
    )
  }

  const embedUrl = videoData.embedUrl || `https://www.eporner.com/embed/${id}/`

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <SiteHeader showSearch={false} />

      <main className="max-w-[1600px] mx-auto px-4 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Video Player - Embed */}
            <div className="bg-black rounded-xl overflow-hidden shadow-2xl">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={embedUrl}
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  title={videoData.title}
                />
              </div>
            </div>

            {/* Video Info */}
            <div className="bg-[#1b1b1b] rounded-xl border border-[#2c2c2c] p-4 sm:p-5">
              <h1 className="text-lg sm:text-xl font-bold text-white leading-tight">{videoData.title}</h1>

              {/* Stats Row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-gray-400">
                {videoData.views && (
                  <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" />{videoData.views} views</span>
                )}
                {videoData.rating && parseFloat(videoData.rating) > 0 && (
                  <span className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />{videoData.rating}
                  </span>
                )}
                {videoData.duration && (
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{videoData.duration}</span>
                )}
                {videoData.addedDate && (
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{videoData.addedDate}</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#2c2c2c]">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${liked ? 'bg-[#FF9000] text-black' : 'bg-[#2c2c2c] text-white hover:bg-[#3c3c3c]'}`}
                >
                  <ThumbsUp className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                  <span className="text-sm font-medium">{liked ? 'Liked!' : 'Like'}</span>
                </button>
                <button className="px-4 py-2 rounded-full bg-[#2c2c2c] text-white hover:bg-[#3c3c3c] transition-colors flex items-center gap-2">
                  <Share2 className="w-4 h-4" /><span className="text-sm">Share</span>
                </button>
                {videoData.url && (
                  <a
                    href={videoData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full bg-[#2c2c2c] text-white hover:bg-[#3c3c3c] transition-colors flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" /><span className="text-sm">Source</span>
                  </a>
                )}
              </div>
            </div>

            {/* Categories Section */}
            {videoData.categories && videoData.categories.length > 0 && (
              <div className="bg-[#1b1b1b] rounded-xl border border-[#2c2c2c] p-4">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#FF9000]" />Tags & Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {videoData.categories.map((cat: string) => (
                    <Link
                      key={cat}
                      href={`/?category=${cat.toLowerCase().replace(/\s+/g, '-')}`}
                      className="px-3 py-1.5 bg-[#2c2c2c] rounded-full text-sm text-gray-300 hover:bg-[#FF9000] hover:text-black transition-colors"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Thumbnail Gallery */}
            {videoData.thumbs && videoData.thumbs.length > 1 && (
              <div className="bg-[#1b1b1b] rounded-xl border border-[#2c2c2c] p-4">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Film className="w-4 h-4 text-[#FF9000]" />Screenshots
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {videoData.thumbs.slice(0, 10).map((thumb: string, i: number) => (
                    <div key={i} className="relative aspect-video rounded-lg overflow-hidden bg-[#2c2c2c]">
                      <img src={thumb} alt={`Screenshot ${i + 1}`} loading="lazy" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mobile Related Videos */}
            <div className="lg:hidden">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Film className="w-5 h-5 text-[#FF9000]" />More Videos
              </h3>
              {recommendedLoading ? (
                <RelatedVideosSkeleton />
              ) : recommendedVideos.length > 0 ? (
                <div className="space-y-3">
                  {recommendedVideos.slice(0, 6).map(v => <RelatedVideoCard key={v.id} video={v} />)}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No recommended videos</p>
              )}
            </div>
          </div>

          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-[400px] shrink-0 space-y-4">
            <div className="bg-[#1b1b1b] rounded-xl border border-[#2c2c2c] p-4 sticky top-20">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Film className="w-5 h-5 text-[#FF9000]" />Recommended Videos
              </h3>
              {recommendedLoading ? (
                <RelatedVideosSkeleton />
              ) : recommendedVideos.length > 0 ? (
                <div className="space-y-3">
                  {recommendedVideos.map(v => <RelatedVideoCard key={v.id} video={v} />)}
                  <Link
                    href="/"
                    className="flex items-center justify-center gap-2 py-3 text-[#FF9000] text-sm font-medium hover:underline"
                  >
                    Browse More Videos
                  </Link>
                </div>
              ) : (
                <p className="text-gray-500 text-sm py-4 text-center">No recommended videos available</p>
              )}
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

export default function WatchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-[#FF9000]" />
          <p className="text-gray-400">Loading video...</p>
        </div>
      </div>
    }>
      <WatchContent />
    </Suspense>
  )
}
