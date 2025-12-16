"use client"

import { Suspense, useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useChannels, usePrefetch, prefetchChannel } from '@/hooks/use-scraper'
import SiteHeader from '@/components/site-header'
import SiteFooter from '@/components/site-footer'
import { Loader2, Tv, Search, ChevronLeft, ChevronRight, ArrowUpDown, SortAsc, SortDesc } from 'lucide-react'

const ITEMS_PER_PAGE = 48

type SortOption = 'name-asc' | 'name-desc' | 'videos-desc' | 'videos-asc'

function getColor(name: string): string {
  const colors = [
    'from-red-500 to-pink-500',
    'from-orange-500 to-amber-500',
    'from-yellow-500 to-lime-500',
    'from-green-500 to-emerald-500',
    'from-teal-500 to-cyan-500',
    'from-blue-500 to-indigo-500',
    'from-violet-500 to-purple-500',
    'from-fuchsia-500 to-pink-500',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

function ChannelsContent() {
  const { data: channels, loading } = useChannels()
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<SortOption>('name-asc')
  usePrefetch()

  const sorted = useMemo(() => {
    if (!channels) return []

    let filtered = channels.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase())
    )

    switch (sortBy) {
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'videos-desc':
        filtered.sort((a, b) => (b.videoCount || 0) - (a.videoCount || 0))
        break
      case 'videos-asc':
        filtered.sort((a, b) => (a.videoCount || 0) - (b.videoCount || 0))
        break
    }

    return filtered
  }, [channels, search, sortBy])

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE)

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return sorted.slice(start, start + ITEMS_PER_PAGE)
  }, [sorted, currentPage])

  const handleSearch = (value: string) => {
    setSearch(value)
    setCurrentPage(1)
  }

  const handleSort = (option: SortOption) => {
    setSortBy(option)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <SiteHeader showSearch={false} />

      <main className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Tv className="w-6 h-6 text-[#FF9000]" />Sites / Channels
              {channels && <span className="text-sm font-normal text-gray-500">({channels.length})</span>}
            </h1>
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" value={search} onChange={e => handleSearch(e.target.value)} placeholder="Search sites..."
                className="w-full pl-10 pr-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FF9000]" />
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-400 flex items-center gap-1"><ArrowUpDown className="w-4 h-4" />Sort:</span>
            {[
              { value: 'name-asc', label: 'Name A-Z', icon: SortAsc },
              { value: 'name-desc', label: 'Name Z-A', icon: SortDesc },
              { value: 'videos-desc', label: 'Most Videos', icon: SortDesc },
              { value: 'videos-asc', label: 'Least Videos', icon: SortAsc },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => handleSort(opt.value as SortOption)}
                className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1 transition-colors ${sortBy === opt.value
                  ? 'bg-[#FF9000] text-black font-medium'
                  : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a]'
                  }`}
              >
                <opt.icon className="w-3 h-3" />{opt.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF9000]" />
          </div>
        ) : paginatedItems.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {paginatedItems.map(channel => (
                <Link key={channel.slug} href={`/?view=channel&channel=${channel.slug}`} onMouseEnter={() => prefetchChannel(channel.slug)}
                  className="group bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] hover:border-[#FF9000]/50 transition-all overflow-hidden">
                  <div className="aspect-video relative bg-[#2c2c2c]">
                    {channel.thumbnail ? (
                      <Image src={channel.thumbnail} alt={channel.name} fill className="object-cover group-hover:scale-105 transition-transform" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw" />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${getColor(channel.name)}`}>
                        <span className="text-3xl font-bold text-white/90 drop-shadow-lg">
                          {channel.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="font-medium text-white text-sm group-hover:text-[#FF9000] truncate">{channel.name}</h3>
                    {channel.videoCount && channel.videoCount > 0 && <p className="text-xs text-gray-500 mt-0.5">{channel.videoCount} videos</p>}
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className="px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white disabled:opacity-50 hover:border-[#FF9000] flex items-center gap-1">
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>
                <div className="flex items-center gap-1">
                  {currentPage > 3 && (
                    <><button onClick={() => setCurrentPage(1)} className="w-10 h-10 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-white hover:border-[#FF9000]">1</button>
                      {currentPage > 4 && <span className="text-gray-500 px-2">...</span>}</>
                  )}
                  {Array.from({ length: 5 }, (_, i) => currentPage - 2 + i).filter(p => p >= 1 && p <= totalPages).map(page => (
                    <button key={page} onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg border ${page === currentPage ? 'bg-[#FF9000] border-[#FF9000] text-black font-bold' : 'bg-[#1a1a1a] border-[#2a2a2a] text-white hover:border-[#FF9000]'}`}>
                      {page}
                    </button>
                  ))}
                  {currentPage < totalPages - 2 && (
                    <>{currentPage < totalPages - 3 && <span className="text-gray-500 px-2">...</span>}
                      <button onClick={() => setCurrentPage(totalPages)} className="w-10 h-10 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-white hover:border-[#FF9000]">{totalPages}</button></>
                  )}
                </div>
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white disabled:opacity-50 hover:border-[#FF9000] flex items-center gap-1">
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="mt-4 text-center text-sm text-gray-500">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, sorted.length)} of {sorted.length} sites
              {search && ` (filtered from ${channels?.length || 0})`}
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-gray-500">
            {search ? `No sites found for "${search}"` : 'No sites found'}
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}

export default function ChannelsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#FF9000]" /></div>}>
      <ChannelsContent />
    </Suspense>
  )
}
