'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import { ChannelCard, ChannelCardSkeleton } from '@/components/ChannelCard'
import Pagination from '@/components/Pagination'
import { LeaderboardAd, FooterAd } from '@/components/ad-banner'
import type { ChannelItem } from '@/lib/scraper/types'
import { Tv } from 'lucide-react'

interface ChannelsClientProps {
  initialChannels: ChannelItem[]
  initialHasMore: boolean
}

export default function ChannelsClient({ initialChannels, initialHasMore }: ChannelsClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentPage = parseInt(searchParams.get('page') || '1', 10)

  const [channels, setChannels] = useState<ChannelItem[]>(initialChannels)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialHasMore)

  // Sync initial props
  useEffect(() => {
    setChannels(initialChannels)
    setHasMore(initialHasMore)
    setLoading(false)
  }, [initialChannels, initialHasMore, currentPage])

  const handlePageChange = (page: number) => {
    setLoading(true)
    const params = new URLSearchParams()
    params.set('page', String(page))
    router.push(`/channels?${params.toString()}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <LeaderboardAd />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 flex items-end justify-between border-b border-white/5 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <Tv className="w-6 h-6 text-cyan-400" />
              Channels
            </h1>
            <p className="text-gray-400 text-sm">
              Explore trending channels and studios
            </p>
          </div>
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {loading ? (
            // Skeletons
            Array.from({ length: 20 }).map((_, i) => (
              <ChannelCardSkeleton key={i} />
            ))
          ) : (
            channels.map((channel) => (
              <ChannelCard key={channel.id} channel={channel} />
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && channels.length > 0 && (
          <div className="mt-12 mb-8">
            <Pagination
              currentPage={currentPage}
              hasMore={hasMore}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </main>

      <FooterAd />
    </div>
  )
}
