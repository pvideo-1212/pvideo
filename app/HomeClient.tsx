'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import VideoCard, { VideoCardSkeleton } from '@/components/VideoCard'
import Pagination from '@/components/Pagination'
import { LeaderboardAd, FooterAd } from '@/components/ad-banner'
import type { VideoItem, PaginatedResponse } from '@/lib/scraper/types'
import { Flame, RefreshCcw } from 'lucide-react'

interface HomeClientProps {
  initialVideos: VideoItem[]
  initialHasMore: boolean
}

export default function HomeClient({ initialVideos, initialHasMore }: HomeClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Derive state directly from URL params
  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const searchQuery = searchParams.get('q') || ''

  // Loading state for navigation feedback
  const [isNavigating, setIsNavigating] = useState(false)

  // Reset loading state when videos update (navigation complete)
  useEffect(() => {
    setIsNavigating(false)
  }, [initialVideos])

  // Handle search - navigate to new URL
  const handleSearch = (query: string) => {
    if (query) {
      router.push(`/?q=${encodeURIComponent(query)}&page=1`)
    } else {
      router.push('/')
    }
  }

  // Handle page change - navigate to new URL
  const handlePageChange = (page: number) => {
    setIsNavigating(true)
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    params.set('page', String(page))
    router.push(`/?${params.toString()}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Use initialVideos directly (Server Component passes fresh data on navigation)
  const videos = initialVideos
  const hasMore = initialHasMore

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onSearch={handleSearch} initialQuery={searchQuery} />

      {/* Leaderboard Ad */}
      <LeaderboardAd />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-6 flex items-end justify-between border-b border-white/5 pb-4">
          <div>
            {searchQuery ? (
              <h1 className="text-2xl font-bold text-white mb-1">
                Results for <span className="text-purple-400">"{searchQuery}"</span>
              </h1>
            ) : (
              <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
                Latest Videos
              </h1>
            )}
            <p className="text-sm text-gray-500">
              Page {currentPage} {videos.length > 0 && `• ${videos.length} videos`}
            </p>
          </div>
        </div>

        {/* Video Grid - Dense Layout */}
        <section aria-label="Latest Videos" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-y-8">
          {isNavigating ? (
            // Skeletons when navigating
            Array.from({ length: 20 }).map((_, i) => (
              <VideoCardSkeleton key={i} />
            ))
          ) : (
            videos.map((video) => (
              <article key={video.id}>
                <VideoCard video={video} />
              </article>
            ))
          )}
        </section>

        {/* Pagination */}
        {!isNavigating && videos.length > 0 && (
          <div className="mt-12 mb-8">
            <Pagination
              currentPage={currentPage}
              hasMore={hasMore}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* No results */}
        {!isNavigating && videos.length === 0 && (
          <div className="text-center py-32">
            <p className="text-xl text-gray-500 mb-4">No videos found matching your criteria</p>
            <button
              onClick={() => router.push('/')}
              className="text-purple-400 hover:text-white font-medium transition-colors"
            >
              Back to Home
            </button>
          </div>
        )}
      </main>

      {/* Footer Ad */}
      <FooterAd />
    </div>
  )
}
