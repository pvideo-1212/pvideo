"use client"

import { useState, Suspense } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useVideos, usePornstars } from '@/hooks/use-scraper'
import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import { Loader2, User, Play, Eye, ChevronLeft, ChevronRight, Film, Star, ArrowLeft } from 'lucide-react'

// Generate consistent color for avatar
function getColor(name: string): string {
  const colors = [
    'from-pink-500 to-rose-500',
    'from-amber-500 to-orange-500',
    'from-lime-500 to-green-500',
    'from-emerald-500 to-teal-500',
    'from-cyan-500 to-blue-500',
    'from-indigo-500 to-violet-500',
    'from-purple-500 to-fuchsia-500',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

function VideoCard({ video }: { video: any }) {
  const id = video.id
  const [currentThumb, setCurrentThumb] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const thumbs = video.thumbs || [video.thumbnail]

  return (
    <Link
      href={`/watch/${id}`}
      className="group block bg-[#1a1a1a] rounded-xl overflow-hidden border border-[#2a2a2a] hover:border-[#FF9000]/50 transition-all"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => { setIsHovering(false); setCurrentThumb(0) }}
    >
      <div className="relative aspect-video bg-[#0d0d0d] overflow-hidden">
        {thumbs[currentThumb] ? (
          <Image src={thumbs[currentThumb]} alt="" fill className="object-cover group-hover:scale-105 transition-transform" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"><Play className="w-8 h-8 text-gray-600" /></div>
        )}
        {video.duration && <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 rounded text-xs font-medium text-white">{video.duration}</div>}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[#FF9000] flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all">
            <Play className="w-6 h-6 text-black fill-black ml-0.5" />
          </div>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-medium text-white text-sm line-clamp-2 group-hover:text-[#FF9000]">{video.title}</h3>
        <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
          {video.views && <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{video.views}</span>}
          {video.rating && parseFloat(video.rating) > 0 && <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />{video.rating}</span>}
        </div>
      </div>
    </Link>
  )
}

function PornstarContent() {
  const params = useParams()
  const slug = params.slug as string
  const [page, setPage] = useState(1)

  const { data: pornstars } = usePornstars()
  const { data: vids, loading } = useVideos(undefined, undefined, slug, page)

  const pornstar = pornstars?.find(p => p.slug === slug)
  const starName = pornstar?.name || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  const videos = vids?.videos || []
  const totalCount = vids?.totalCount || 0

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <SiteHeader showSearch={false} />

      <main className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Back Button */}
        <Link href="/pornstars" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#FF9000] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />Back to Models
        </Link>

        {/* Pornstar Info */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-24 h-24 rounded-full overflow-hidden shrink-0 shadow-lg shadow-black/50">
            {pornstar?.thumbnail ? (
              <Image src={pornstar.thumbnail} alt={starName} width={96} height={96} className="object-cover w-full h-full" />
            ) : (
              <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${getColor(starName)}`}>
                <span className="text-3xl font-bold text-white/90 drop-shadow-lg">
                  {starName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{starName}</h1>
            <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
              <Film className="w-4 h-4" />
              {loading && videos.length === 0 ? 'Loading videos...' : `${totalCount.toLocaleString()} videos`}
            </p>
            {pornstar?.videoCount && pornstar.videoCount > 0 && (
              <p className="text-xs text-gray-500 mt-1">From models database: {pornstar.videoCount} scenes</p>
            )}
          </div>
        </div>

        {/* Videos Grid */}
        {loading && videos.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF9000]" />
          </div>
        ) : videos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {videos.map(v => <VideoCard key={v.id} video={v} />)}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <button onClick={() => { setPage(1); window.scrollTo(0, 0) }} disabled={page === 1}
                className="px-3 py-2 bg-[#2c2c2c] text-white rounded-lg disabled:opacity-50 text-sm">First</button>
              <button onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo(0, 0) }} disabled={page === 1}
                className="px-4 py-2 bg-[#2c2c2c] text-white rounded-lg disabled:opacity-50 flex items-center gap-1">
                <ChevronLeft className="w-4 h-4" />Prev
              </button>
              <span className="px-4 py-2 text-gray-400">Page {page}</span>
              <button onClick={() => { setPage(p => p + 1); window.scrollTo(0, 0) }}
                className="px-4 py-2 bg-[#FF9000] text-black font-medium rounded-lg flex items-center gap-1">
                Next<ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-gray-500">No videos found</div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}

export default function PornstarDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#FF9000]" /></div>}>
      <PornstarContent />
    </Suspense>
  )
}
