"use client"

import { useState, Suspense, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import { useVideoDetail, useRecommendedVideos } from '@/hooks/use-scraper'
import { Loader2, Play, Eye, ThumbsUp, Share2, Film, Calendar, Tag, Home, Star, Clock, ChevronDown, User } from 'lucide-react'
import { MyBidBanner, SidebarAd, InContentAd } from '@/components/ad-banner'
import { HLSPlayer } from '@/components/hls-player'

// Track video for sitemap and SEO
async function trackVideoPlay(video: {
  id: string
  title?: string
  thumbnail?: string
  duration?: string
  views?: string
  rating?: string
  categories?: string[]
}) {
  try {
    await fetch('/api/track-video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: video.id,
        title: video.title || 'Video',
        thumbnail: video.thumbnail,
        duration: video.duration,
        views: video.views,
        rating: video.rating,
        categories: video.categories
      })
    })
  } catch (error) {
    // Silently fail - tracking is non-critical
    console.error('[TrackVideo] Failed:', error)
  }
}

// Format view count to readable format
function formatViews(views: string | number): string {
  if (!views) return ''
  const num = typeof views === 'string' ? parseInt(views.replace(/[^0-9]/g, '')) : views
  if (isNaN(num)) return String(views)
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return String(num)
}

// Related video card with native img - Enhanced with complete details
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
        {/* Quality Badge */}
        <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#FF9000] rounded text-[10px] text-black font-bold">
          HD
        </span>
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
        {/* Enhanced Stats Row */}
        <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
          {video.views && (
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />{formatViews(video.views)}
            </span>
          )}
          {video.rating && parseFloat(video.rating) > 0 && (
            <span className="flex items-center gap-1 text-green-500">
              <Star className="w-3 h-3 fill-current" />{video.rating}%
            </span>
          )}
        </div>
        {/* Uploader if available */}
        {video.uploader && (
          <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-500">
            <User className="w-3 h-3" />
            <span className="truncate">{video.uploader}</span>
          </div>
        )}
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
  const { videos: recommendedVideos, loading: recommendedLoading, loadMore, hasMore } = useRecommendedVideos(
    id,
    videoData?.categories
  )

  const [liked, setLiked] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  // Track video for sitemap and SEO when data loads
  useEffect(() => {
    if (videoData && videoData.id && videoData.title) {
      trackVideoPlay({
        id: videoData.id,
        title: videoData.title,
        thumbnail: videoData.thumbnail,
        duration: videoData.duration,
        views: videoData.views,
        rating: videoData.rating,
        categories: videoData.categories
      })
    }
  }, [videoData])

  const handleLoadMore = async () => {
    setLoadingMore(true)
    await loadMore()
    setLoadingMore(false)
  }

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

  // Use the actual Eporner embed URL from video data
  const embedUrl = videoData.embedUrl || `https://www.eporner.com/embed/${id}/`

  return (
    <div className="min-h-screen bg-[#0d0d0d] overflow-x-hidden">
      <SiteHeader showSearch={false} />

      <main className="max-w-[1600px] mx-auto px-4 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Video Player - HLS Player with Mobile Support */}
            <HLSPlayer
              videoId={id}
              title={videoData.title || 'Video'}
              thumbnail={videoData.thumbnail}
            />

            {/* Video Info - Improved Mobile Layout */}
            <div className="bg-[#1b1b1b] rounded-xl border border-[#2c2c2c] p-4 sm:p-5">
              <h1 className="text-lg sm:text-xl font-bold text-white leading-tight">{videoData.title || 'Untitled Video'}</h1>

              {/* Mobile: Stats + Actions */}
              <div className="sm:hidden mt-4 space-y-4">
                {/* Stats Row */}
                <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-[#FF9000]" />{videoData.views || '0'} views
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />{videoData.rating || '0'}%
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-400" />{videoData.duration || '--:--'}
                  </span>
                </div>

                {/* Mobile Action Buttons - Full Width with 44px+ height */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setLiked(!liked)}
                    className={`flex-1 h-12 rounded-xl flex items-center justify-center gap-2 font-medium transition-all ${liked ? 'bg-[#FF9000] text-black' : 'bg-[#2c2c2c] text-white active:bg-[#3c3c3c]'}`}
                  >
                    <ThumbsUp className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                    <span>{liked ? 'Liked!' : 'Like'}</span>
                  </button>
                  <button className="flex-1 h-12 rounded-xl bg-[#2c2c2c] text-white flex items-center justify-center gap-2 font-medium active:bg-[#3c3c3c] transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              {/* Desktop: Stats Cards Row */}
              <div className="hidden sm:grid grid-cols-4 gap-3 mt-4">
                <div className="bg-[#252525] rounded-lg p-3 text-center">
                  <Eye className="w-5 h-5 text-[#FF9000] mx-auto mb-1" />
                  <p className="text-lg font-bold text-white">{videoData.views || '0'}</p>
                  <p className="text-xs text-gray-500">Views</p>
                </div>
                <div className="bg-[#252525] rounded-lg p-3 text-center">
                  <Star className="w-5 h-5 text-yellow-500 mx-auto mb-1 fill-yellow-500" />
                  <p className="text-lg font-bold text-white">{videoData.rating || '0'}%</p>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
                <div className="bg-[#252525] rounded-lg p-3 text-center">
                  <Clock className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                  <p className="text-lg font-bold text-white">{videoData.duration || '--:--'}</p>
                  <p className="text-xs text-gray-500">Duration</p>
                </div>
                <div className="bg-[#252525] rounded-lg p-3 text-center">
                  <Calendar className="w-5 h-5 text-green-500 mx-auto mb-1" />
                  <p className="text-sm font-bold text-white truncate">{videoData.addedDate?.split(' ')[0] || 'N/A'}</p>
                  <p className="text-xs text-gray-500">Added</p>
                </div>
              </div>

              {/* Rating Bar - Hidden on mobile */}
              {videoData.rating && parseFloat(videoData.rating) > 0 && (
                <div className="hidden sm:block mt-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-400">User Rating</span>
                    <span className="text-[#FF9000] font-semibold">{videoData.rating}%</span>
                  </div>
                  <div className="h-2 bg-[#252525] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#FF9000] to-[#FFa030] rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(parseFloat(videoData.rating), 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Desktop Actions */}
              <div className="hidden sm:flex flex-wrap gap-2 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-[#2c2c2c]">
                <button
                  onClick={() => setLiked(!liked)}
                  className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-full flex items-center gap-1.5 sm:gap-2 transition-all font-medium text-xs sm:text-sm ${liked ? 'bg-[#FF9000] text-black shadow-lg shadow-[#FF9000]/20' : 'bg-[#2c2c2c] text-white hover:bg-[#3c3c3c]'}`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${liked ? 'fill-current' : ''}`} />
                  <span>{liked ? 'Liked!' : 'Like'}</span>
                </button>
                <button className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#2c2c2c] text-white hover:bg-[#3c3c3c] transition-colors flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                  <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /><span>Share</span>
                </button>
              </div>
            </div>

            {/* Categories Section - Improved Mobile */}
            {videoData.categories && videoData.categories.length > 0 && (
              <div className="bg-[#1b1b1b] rounded-xl border border-[#2c2c2c] p-4">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#FF9000]" />Tags & Categories
                </h3>
                <div className="flex flex-wrap gap-2 sm:gap-2.5">
                  {videoData.categories.map((cat: string) => (
                    <Link
                      key={cat}
                      href={`/?category=${cat.toLowerCase().replace(/\s+/g, '-')}`}
                      className="px-4 py-2 bg-[#2c2c2c] rounded-full text-sm text-gray-300 hover:bg-[#FF9000] hover:text-black transition-colors active:scale-95"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Screenshot Gallery */}
            {/* {videoData.thumbs && videoData.thumbs.length > 1 && (
              <div className="bg-[#1b1b1b] rounded-xl border border-[#2c2c2c] p-4">
                <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                  <Film className="w-5 h-5 text-[#FF9000]" />
                  Video Preview ({videoData.thumbs.length} Screenshots)
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {videoData.thumbs.slice(0, 15).map((thumb: string, i: number) => (
                    <div
                      key={i}
                      className="relative aspect-video rounded-lg overflow-hidden bg-[#2c2c2c] group cursor-pointer"
                    >
                      <img
                        src={thumb}
                        alt={`Preview ${i + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <span className="absolute bottom-1 left-1 text-[10px] text-white/80 bg-black/60 px-1.5 py-0.5 rounded">
                          {i + 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )} */}

            {/* Mobile Related Videos - 2 Column Grid */}
            <div className="lg:hidden">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Film className="w-5 h-5 text-[#FF9000]" />More Videos For You
              </h3>
              {recommendedLoading ? (
                <RelatedVideosSkeleton />
              ) : recommendedVideos.length > 0 ? (
                <>
                  {/* 2-column grid on mobile - Enhanced with complete details */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {recommendedVideos.slice(0, 4).map(v => (
                      <Link key={v.id} href={`/watch/${v.id}`} className="group">
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-[#2c2c2c]">
                          {v.thumbnail && (
                            <img
                              src={v.thumbnail}
                              alt=""
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          )}
                          {/* Quality Badge */}
                          <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#FF9000] rounded text-[10px] text-black font-bold">
                            HD
                          </span>
                          {v.duration && (
                            <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 rounded text-[10px] text-white font-medium">
                              {v.duration}
                            </span>
                          )}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-[#FF9000] flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all">
                              <Play className="w-5 h-5 text-black fill-black ml-0.5" />
                            </div>
                          </div>
                        </div>
                        <h4 className="text-xs text-white font-medium line-clamp-2 mt-2 group-hover:text-[#FF9000] transition-colors">
                          {v.title}
                        </h4>
                        {/* Enhanced stats with all details */}
                        <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 mt-1 text-[10px] text-gray-500">
                          {v.views && (
                            <span className="flex items-center gap-0.5">
                              <Eye className="w-2.5 h-2.5" />{formatViews(v.views)}
                            </span>
                          )}
                          {v.rating && parseFloat(v.rating) > 0 && (
                            <span className="flex items-center gap-0.5 text-green-500">
                              <Star className="w-2.5 h-2.5 fill-current" />{v.rating}%
                            </span>
                          )}
                        </div>
                        {v.uploader && (
                          <div className="text-[10px] text-gray-600 mt-0.5 truncate">
                            {v.uploader}
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>

                  {/* Mobile In-Content Ad */}
                  {recommendedVideos.length > 4 && (
                    <div className="mb-4 rounded-xl overflow-hidden bg-[#1a1a1a] border border-[#2a2a2a] p-2">
                      <MyBidBanner bannerId="2015213" className="w-full min-h-[90px]" />
                    </div>
                  )}

                  {/* More videos after ad */}
                  {recommendedVideos.length > 4 && (
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {recommendedVideos.slice(4, 8).map(v => (
                        <Link key={v.id} href={`/watch/${v.id}`} className="group">
                          <div className="relative aspect-video rounded-lg overflow-hidden bg-[#2c2c2c]">
                            {v.thumbnail && (
                              <img
                                src={v.thumbnail}
                                alt=""
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            )}
                            <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#FF9000] rounded text-[10px] text-black font-bold">
                              HD
                            </span>
                            {v.duration && (
                              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 rounded text-[10px] text-white font-medium">
                                {v.duration}
                              </span>
                            )}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                              <div className="w-10 h-10 rounded-full bg-[#FF9000] flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all">
                                <Play className="w-5 h-5 text-black fill-black ml-0.5" />
                              </div>
                            </div>
                          </div>
                          <h4 className="text-xs text-white font-medium line-clamp-2 mt-2 group-hover:text-[#FF9000] transition-colors">
                            {v.title}
                          </h4>
                          <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 mt-1 text-[10px] text-gray-500">
                            {v.views && (
                              <span className="flex items-center gap-0.5">
                                <Eye className="w-2.5 h-2.5" />{formatViews(v.views)}
                              </span>
                            )}
                            {v.rating && parseFloat(v.rating) > 0 && (
                              <span className="flex items-center gap-0.5 text-green-500">
                                <Star className="w-2.5 h-2.5 fill-current" />{v.rating}%
                              </span>
                            )}
                          </div>
                          {v.uploader && (
                            <div className="text-[10px] text-gray-600 mt-0.5 truncate">
                              {v.uploader}
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Vertical list below horizontal scroll - Keep Watching */}
                  {recommendedVideos.length > 8 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-gray-400">Keep Watching</h4>
                      {recommendedVideos.slice(8).map(v => <RelatedVideoCard key={v.id} video={v} />)}
                    </div>
                  )}

                  {/* Load More Button - No redirect! */}
                  {hasMore && (
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="flex items-center justify-center gap-2 py-4 mt-4 w-full text-[#FF9000] text-sm font-medium hover:bg-[#FF9000]/10 border-t border-[#2c2c2c] transition-colors disabled:opacity-50"
                    >
                      {loadingMore ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Loading more...
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          Load More Videos
                        </>
                      )}
                    </button>
                  )}
                </>
              ) : (
                <p className="text-gray-500 text-sm">No recommended videos</p>
              )}
            </div>
          </div>

          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-[400px] shrink-0 space-y-4">
            <div className="bg-[#1b1b1b] rounded-xl border border-[#2c2c2c] p-4 sticky top-20">
              {/* Ad Banners - Top of Sidebar */}
              <div className="mb-4 rounded-lg overflow-hidden bg-[#252525] min-h-[90px] space-y-2">
                <MyBidBanner bannerId="2015213" className="w-full" />
                <MyBidBanner bannerId="2015214" className="w-full" />
              </div>

              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <Film className="w-5 h-5 text-[#FF9000]" />Recommended Videos
              </h3>
              {recommendedLoading ? (
                <RelatedVideosSkeleton />
              ) : recommendedVideos.length > 0 ? (
                <div className="space-y-3">
                  {recommendedVideos.slice(0, 5).map(v => <RelatedVideoCard key={v.id} video={v} />)}

                  {/* Ad Banners - Middle of sidebar */}
                  <div className="py-2 rounded-lg overflow-hidden bg-[#252525] min-h-[90px] space-y-2">
                    <MyBidBanner bannerId="2015214" className="w-full" />
                    <MyBidBanner bannerId="2015213" className="w-full" />
                  </div>

                  {recommendedVideos.slice(5).map(v => <RelatedVideoCard key={v.id} video={v} />)}

                  {/* Load More Button - Desktop Sidebar */}
                  {hasMore && (
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="flex items-center justify-center gap-2 py-3 w-full text-[#FF9000] text-sm font-medium hover:bg-[#FF9000]/10 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {loadingMore ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          Load More Videos
                        </>
                      )}
                    </button>
                  )}
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
