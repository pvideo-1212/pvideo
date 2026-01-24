'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import { ModelCard, ModelCardSkeleton } from '@/components/ModelCard'
import Pagination from '@/components/Pagination'
import { LeaderboardAd, FooterAd } from '@/components/ad-banner'
import type { ModelItem } from '@/lib/scraper/types'
import { User, RefreshCcw } from 'lucide-react'

interface ModelsClientProps {
  initialModels: ModelItem[]
  initialHasMore: boolean
}

export default function ModelsClient({ initialModels, initialHasMore }: ModelsClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentPage = parseInt(searchParams.get('page') || '1', 10)

  const [models, setModels] = useState<ModelItem[]>(initialModels)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialHasMore)

  // Sync initial props
  useEffect(() => {
    setModels(initialModels)
    setHasMore(initialHasMore)
    setLoading(false)
  }, [initialModels, initialHasMore, currentPage])

  const handlePageChange = (page: number) => {
    setLoading(true)
    const params = new URLSearchParams()
    params.set('page', String(page))
    router.push(`/models?${params.toString()}`)
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
              <User className="w-6 h-6 text-purple-400" />
              Models
            </h1>
            <p className="text-gray-400 text-sm">
              Discover popular models and stars
            </p>
          </div>
        </div>

        {/* Models Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {loading ? (
            // Skeletons
            Array.from({ length: 20 }).map((_, i) => (
              <ModelCardSkeleton key={i} />
            ))
          ) : (
            models.map((model) => (
              <ModelCard key={model.id} model={model} />
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && models.length > 0 && (
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
