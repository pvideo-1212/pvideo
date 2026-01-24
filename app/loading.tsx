import { VideoCardSkeleton } from '@/components/VideoCard'
import { Flame } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-50 w-full backdrop-blur-xl bg-black/80 border-b border-white/10 h-[65px]" />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Title Skeleton */}
        <div className="mb-6 flex items-end justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-gray-800 animate-pulse" />
            <div className="h-8 w-48 bg-gray-800 rounded animate-pulse" />
          </div>
        </div>

        {/* Video Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-y-8">
          {Array.from({ length: 20 }).map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      </main>
    </div>
  )
}
