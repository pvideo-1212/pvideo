"use client"

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useCategories, useChannels, usePornstars, useVideos, useSearch, usePrefetch, prefetchCategory, prefetchChannel, prefetchModel, useSearchSuggestions } from '@/hooks/use-scraper'
import SiteFooter from '@/components/site-footer'
import { Play, Eye, ChevronRight, ChevronLeft, Loader2, Search, X, TrendingUp, Flame, Grid3X3, Film, Tv, User, Menu, Home as HomeIcon, Clock, Star, ArrowUpDown, Shield } from 'lucide-react'
import { AdBanner, MyBidBanner } from '@/components/ad-banner'

// Helper function to get quality badge info
function getQualityInfo(video: any): { label: string; class: string } | null {
  // Try to detect quality from various sources
  const title = video.title?.toLowerCase() || ''
  const quality = video.quality || ''

  if (title.includes('4k') || title.includes('2160p') || quality.includes('4k') || quality.includes('2160')) {
    return { label: '4K', class: 'quality-badge-4k' }
  }
  if (title.includes('1080p') || title.includes('1080') || quality.includes('1080')) {
    return { label: 'HD', class: 'quality-badge-hd' }
  }
  if (title.includes('720p') || title.includes('720') || quality.includes('720') || quality.includes('hd')) {
    return { label: 'HD', class: 'quality-badge-hd' }
  }
  // Default to HD for most videos (as Eporner mostly serves HD)
  return { label: 'HD', class: 'quality-badge-hd' }
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

// Premium Video Card with quality badges, glow effects, and improved styling
function VideoCard({ video }: { video: any }) {
  const [currentThumb, setCurrentThumb] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  const id = video.id
  const thumbs = video.thumbs?.length > 0 ? video.thumbs : [video.thumbnail]
  const qualityInfo = getQualityInfo(video)

  useEffect(() => {
    if (!isHovering || thumbs.length <= 1) return

    const interval = setInterval(() => {
      setCurrentThumb(prev => (prev + 1) % thumbs.length)
    }, 600) // Slightly faster for smoother preview

    return () => clearInterval(interval)
  }, [isHovering, thumbs.length])

  return (
    <Link
      href={`/watch/${id}`}
      className="video-card group block"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => { setIsHovering(false); setCurrentThumb(0) }}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video bg-[#0d0d0d] overflow-hidden">
        {/* Quality Badge */}
        {qualityInfo && (
          <div className={`quality-badge ${qualityInfo.class}`}>
            {qualityInfo.label}
          </div>
        )}

        {/* Thumbnail Image */}
        {thumbs[currentThumb] ? (
          <>
            {!imgLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] animate-pulse" />
            )}
            <img
              src={thumbs[currentThumb]}
              alt=""
              loading="lazy"
              onLoad={() => setImgLoaded(true)}
              className={`w-full h-full object-cover transition-transform duration-500 ${isHovering ? 'scale-110' : 'scale-100'
                } ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d]">
            <Play className="w-10 h-10 text-gray-700" />
          </div>
        )}

        {/* Duration Badge */}
        {video.duration && (
          <div className="duration-badge text-white">
            {video.duration}
          </div>
        )}

        {/* Preview Progress Indicator (shows during hover) */}
        {thumbs.length > 1 && isHovering && (
          <div className="preview-progress">
            <div
              className="preview-progress-bar"
              style={{ width: `${((currentThumb + 1) / thumbs.length) * 100}%` }}
            />
          </div>
        )}

        {/* Play Button Overlay */}
        <div className="play-overlay">
          <div className="play-button">
            <Play className="w-7 h-7 text-black fill-black ml-1" />
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Video Info */}
      <div className="video-info">
        <h3 className="video-title">{video.title}</h3>

        <div className="video-stats">
          {video.views && (
            <span className="video-stat">
              <Eye className="w-3.5 h-3.5" />
              {formatViews(video.views)}
            </span>
          )}
          {video.rating && parseFloat(video.rating) > 0 && (
            <span className="video-stat text-green-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              {video.rating}%
            </span>
          )}
          {video.uploader && (
            <span className="uploader-badge ml-auto">
              {video.uploader}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

// Sort/Order options
const orderOptions = [
  { value: 'top-weekly', label: 'Top Weekly', icon: TrendingUp },
  { value: 'top-monthly', label: 'Top Monthly', icon: TrendingUp },
  { value: 'latest', label: 'Latest', icon: Clock },
  { value: 'top-rated', label: 'Top Rated', icon: Star },
  { value: 'most-popular', label: 'Most Popular', icon: Flame },
  { value: 'longest', label: 'Longest', icon: Clock },
]

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showAllCats, setShowAllCats] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'categories' | 'channels' | null>(null)
  const [orderBy, setOrderBy] = useState('top-weekly')
  const [showOrderMenu, setShowOrderMenu] = useState(false)
  const [searchPage, setSearchPage] = useState(1)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  usePrefetch()

  const { data: cats, loading: catLoad } = useCategories()
  const { data: channels, loading: channelLoad } = useChannels()
  const { data: pornstars } = usePornstars()
  const { data: vids, loading: vidLoad } = useVideos(selectedCategory || undefined, selectedChannel || undefined, selectedModel || undefined, currentPage, orderBy)
  const { data: searchData, loading: searchLoad } = useSearch(searchQuery, searchPage)
  const { suggestions } = useSearchSuggestions(searchQuery)

  const displayVids = searchQuery ? searchData?.videos : vids?.videos
  const displayLoad = searchQuery ? searchLoad : vidLoad
  const totalPages = searchQuery ? (searchData?.totalPages || 50) : (vids?.totalPages || 50)
  const totalCount = searchQuery ? (searchData?.videos?.length || 0) : (vids?.totalCount || 0)

  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    if (p.get('category')) setSelectedCategory(p.get('category'))
    if (p.get('channel')) setSelectedChannel(p.get('channel'))
    if (p.get('model')) setSelectedModel(p.get('model'))
    if (p.get('search')) setSearchQuery(p.get('search') || '')
    if (p.get('view') === 'categories') setViewMode('categories')
    if (p.get('view') === 'channels') setViewMode('channels')
    if (p.get('order')) setOrderBy(p.get('order') || 'top-weekly')
  }, [])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (type: 'category' | 'channel' | 'model', slug: string | null) => {
    setSelectedCategory(type === 'category' ? slug : null)
    setSelectedChannel(type === 'channel' ? slug : null)
    setSelectedModel(type === 'model' ? slug : null)
    setCurrentPage(1)
    setSearchQuery('')
    setMobileMenuOpen(false)
    setViewMode(null)
    const url = slug ? `/?${type}=${slug}` : '/'
    window.history.pushState({}, '', url)
  }

  const handleViewMode = (mode: 'categories' | 'channels' | null) => {
    setViewMode(mode)
    setSelectedCategory(null)
    setSelectedChannel(null)
    setSelectedModel(null)
    setSearchQuery('')
    setMobileMenuOpen(false)
    const url = mode ? `/?view=${mode}` : '/'
    window.history.pushState({}, '', url)
  }

  const handleOrderChange = (order: string) => {
    setOrderBy(order)
    setCurrentPage(1)
    setShowOrderMenu(false)
  }

  const handleSuggestionClick = (suggestion: { type: 'category' | 'model' | 'channel'; name: string; slug: string }) => {
    setShowSuggestions(false)
    setSearchQuery('')
    if (suggestion.type === 'category') {
      handleSelect('category', suggestion.slug)
    } else if (suggestion.type === 'model') {
      handleSelect('model', suggestion.slug)
    } else {
      handleSelect('channel', suggestion.slug)
    }
  }

  const getTitle = () => {
    if (viewMode === 'categories') return 'All Categories'
    if (viewMode === 'channels') return 'All Channels'
    if (searchQuery) return `Search: "${searchQuery}"`
    if (selectedModel) return pornstars?.find(p => p.slug === selectedModel)?.name || selectedModel.replace(/-/g, ' ')
    if (selectedChannel) return channels?.find(c => c.slug === selectedChannel)?.name || selectedChannel.replace(/-/g, ' ')
    if (selectedCategory) return cats?.find(c => c.slug === selectedCategory)?.name || selectedCategory.replace(/-/g, ' ')
    return 'Trending Videos'
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-x-hidden">

      {/* Sticky Header Container with VPN Banner */}
      <div className="sticky top-0 z-50">
        {/* VPN Banner - Compact on mobile */}
        <div className="bg-gradient-to-r from-[#FF9000] via-[#FFa030] to-[#FF9000] text-black py-1.5 sm:py-2 px-3 sm:px-4">
          <div className="max-w-[1600px] mx-auto flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium">
            <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">🔒 Use a VPN for better experience and privacy</span>
            <span className="sm:hidden">🔒 Use VPN for best experience</span>
          </div>
        </div>

        {/* Premium Header */}
        <header className="bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#1f1f1f]">
          <div className="max-w-[1600px] mx-auto px-4">
            <div className="flex items-center h-16 gap-3">
              {/* Logo */}
              <Link href="/" onClick={() => handleSelect('category', null)} className="flex items-center shrink-0">
                <span className="text-2xl font-extrabold text-white tracking-tight">Porn</span>
                <span className="text-2xl font-extrabold bg-[#FF9000] text-black px-2 py-0.5 rounded ml-0.5 tracking-tight">hub</span>
              </Link>

              {/* Navigation - Desktop */}
              <nav className="hidden md:flex items-center gap-1 ml-6">
                <button onClick={() => handleViewMode(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!viewMode && !selectedCategory && !selectedChannel && !selectedModel && !searchQuery ? 'bg-[#FF9000]/15 text-[#FF9000]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                  <HomeIcon className="w-4 h-4 inline mr-1.5" />Home
                </button>
                <button onClick={() => handleViewMode('categories')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'categories' ? 'bg-[#FF9000]/15 text-[#FF9000]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                  <Grid3X3 className="w-4 h-4 inline mr-1.5" />Categories
                </button>
                <button onClick={() => handleViewMode('channels')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'channels' ? 'bg-[#FF9000]/15 text-[#FF9000]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                  <Tv className="w-4 h-4 inline mr-1.5" />Channels
                </button>
                <Link href="/pornstars"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                  <User className="w-4 h-4 inline mr-1.5" />Pornstars
                </Link>
              </nav>

              {/* Search Bar - Flexible with Suggestions */}
              <div className="flex-1 max-w-lg ml-auto" ref={searchRef}>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => { setSearchQuery(e.target.value); setShowSuggestions(true) }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Search videos, categories, models..."
                    className="w-full pl-11 pr-10 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FF9000] focus:ring-1 focus:ring-[#FF9000]/30 transition-all"
                  />
                  {searchQuery && (
                    <button onClick={() => { setSearchQuery(''); setSearchPage(1); setShowSuggestions(false) }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  {/* Search Suggestions Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-xl z-50 overflow-hidden">
                      <div className="p-2 text-xs text-gray-500 border-b border-[#2a2a2a]">
                        Suggestions
                      </div>
                      {suggestions.map((s, i) => (
                        <button
                          key={`${s.type}-${s.slug}-${i}`}
                          onClick={() => handleSuggestionClick(s)}
                          className="w-full px-4 py-3 text-left hover:bg-[#FF9000]/20 transition-colors flex items-center gap-3"
                        >
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${s.type === 'category' ? 'bg-blue-500/20 text-blue-400' :
                              s.type === 'model' ? 'bg-pink-500/20 text-pink-400' :
                                'bg-green-500/20 text-green-400'
                            }`}>
                            {s.type === 'category' ? 'Category' : s.type === 'model' ? 'Model' : 'Channel'}
                          </span>
                          <span className="text-white text-sm">{s.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-[#0a0a0a] border-t border-[#1f1f1f] py-2 px-4">
              <nav className="flex flex-col gap-1">
                <button onClick={() => handleViewMode(null)}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2">
                  <HomeIcon className="w-4 h-4" />Home
                </button>
                <button onClick={() => handleViewMode('categories')}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2">
                  <Grid3X3 className="w-4 h-4" />Categories
                </button>
                <button onClick={() => handleViewMode('channels')}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2">
                  <Tv className="w-4 h-4" />Channels
                </button>
                <Link href="/pornstars"
                  className="px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all flex items-center gap-2">
                  <User className="w-4 h-4" />Pornstars
                </Link>
              </nav>
            </div>
          )}
        </header>
      </div>

      {/* Categories Bar - Horizontal Scroll */}
      <div className="bg-[#0a0a0a] border-b border-[#1f1f1f] sticky top-16 z-40">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => handleSelect('category', null)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shrink-0 ${!selectedCategory && !selectedChannel && !selectedModel ? 'bg-[#FF9000] text-black shadow-lg shadow-[#FF9000]/20' : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#252525] border border-[#2a2a2a]'}`}
            >
              <Flame className="w-4 h-4 inline mr-1.5" />Trending
            </button>

            {catLoad ? (
              <Loader2 className="w-4 h-4 animate-spin text-gray-500 ml-2" />
            ) : (
              cats?.slice(0, showAllCats ? 30 : 10).map(c => (
                <button
                  key={c.slug}
                  onClick={() => handleSelect('category', c.slug)}
                  onMouseEnter={() => prefetchCategory(c.slug)}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all shrink-0 ${selectedCategory === c.slug ? 'bg-[#FF9000] text-black font-medium shadow-lg shadow-[#FF9000]/20' : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#252525] border border-[#2a2a2a]'}`}
                >
                  {c.name}
                </button>
              ))
            )}

            {cats && cats.length > 10 && (
              <button
                onClick={() => setShowAllCats(!showAllCats)}
                className="px-4 py-2 rounded-full text-sm bg-[#1a1a1a] text-[#FF9000] hover:bg-[#252525] border border-[#FF9000]/30 whitespace-nowrap shrink-0 font-medium"
              >
                {showAllCats ? 'Show Less' : `+${cats.length - 10} more`}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-[#FF9000] rounded-full" />
            <h1 className="text-2xl font-bold text-white">{getTitle()}</h1>
            {!viewMode && totalCount > 0 && (
              <span className="text-gray-500 text-sm">
                ({totalCount.toLocaleString()} videos)
              </span>
            )}
            {viewMode === 'categories' && cats?.length && <span className="text-gray-500 text-sm">({cats.length} categories)</span>}
            {viewMode === 'channels' && channels?.length && <span className="text-gray-500 text-sm">({channels.length} channels)</span>}
          </div>

          <div className="flex items-center gap-3">
            {/* Order/Sort Dropdown */}
            {!viewMode && !searchQuery && (
              <div className="relative">
                <button
                  onClick={() => setShowOrderMenu(!showOrderMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-sm text-gray-300 hover:bg-[#252525] transition-colors"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  {orderOptions.find(o => o.value === orderBy)?.label || 'Sort'}
                  <ChevronRight className={`w-4 h-4 transition-transform ${showOrderMenu ? 'rotate-90' : ''}`} />
                </button>

                {showOrderMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowOrderMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-xl z-50 py-1">
                      {orderOptions.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => handleOrderChange(opt.value)}
                          className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 transition-colors ${orderBy === opt.value ? 'bg-[#FF9000]/20 text-[#FF9000]' : 'text-gray-300 hover:bg-white/5'}`}
                        >
                          <opt.icon className="w-4 h-4" />
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {(selectedCategory || selectedChannel || selectedModel || searchQuery || viewMode) && (
              <button
                onClick={() => handleViewMode(null)}
                className="text-sm text-gray-400 hover:text-[#FF9000] px-4 py-2 rounded-lg hover:bg-white/5 transition-all flex items-center gap-1"
              >
                <X className="w-4 h-4" />Clear filter
              </button>
            )}
          </div>
        </div>

        {/* Categories View */}
        {viewMode === 'categories' ? (
          catLoad ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-[#FF9000]" />
              <p className="text-gray-500 text-sm">Loading categories...</p>
            </div>
          ) : cats?.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {cats.map(c => (
                <button
                  key={c.slug}
                  onClick={() => handleSelect('category', c.slug)}
                  onMouseEnter={() => prefetchCategory(c.slug)}
                  className="group bg-gradient-to-br from-[#1a1a1a] to-[#252525] rounded-xl p-6 border border-[#2a2a2a] hover:border-[#FF9000]/50 transition-all hover:shadow-lg hover:shadow-[#FF9000]/10 hover:-translate-y-0.5"
                >
                  <Grid3X3 className="w-8 h-8 text-[#FF9000] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-white text-center text-sm group-hover:text-[#FF9000] transition-colors truncate">{c.name}</h3>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Grid3X3 className="w-16 h-16 text-gray-700" />
              <p className="text-gray-500">No categories found</p>
            </div>
          )
        ) : viewMode === 'channels' ? (
          channelLoad ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-[#FF9000]" />
              <p className="text-gray-500 text-sm">Loading channels...</p>
            </div>
          ) : channels?.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {channels.map(ch => (
                <button
                  key={ch.slug}
                  onClick={() => handleSelect('channel', ch.slug)}
                  onMouseEnter={() => prefetchChannel(ch.slug)}
                  className="group bg-gradient-to-br from-[#1a1a1a] to-[#252525] rounded-xl p-6 border border-[#2a2a2a] hover:border-[#FF9000]/50 transition-all hover:shadow-lg hover:shadow-[#FF9000]/10 hover:-translate-y-0.5"
                >
                  <Tv className="w-8 h-8 text-[#FF9000] mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-white text-center text-sm group-hover:text-[#FF9000] transition-colors truncate">{ch.name}</h3>
                  {ch.videoCount && <p className="text-xs text-gray-500 text-center mt-1">{ch.videoCount} videos</p>}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Tv className="w-16 h-16 text-gray-700" />
              <p className="text-gray-500">No channels found</p>
            </div>
          )
        ) : (
          /* Video Grid - Default View */
          displayLoad && !displayVids?.length ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-[#FF9000]" />
              <p className="text-gray-500 text-sm">Loading videos...</p>
            </div>
          ) : displayVids?.length ? (
            <>
              {/* First row of videos */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
                {displayVids.slice(0, 8).map(v => <VideoCard key={v.id} video={v} />)}
              </div>

              {/* Ad Banners after first 8 videos */}
              {displayVids.length > 8 && (
                <div className="my-4 sm:my-6 rounded-xl overflow-hidden bg-[#1a1a1a] border border-[#2a2a2a] p-2 sm:p-4 space-y-3">
                  <MyBidBanner bannerId="2015213" className="w-full min-h-[90px]" />
                  <AdBanner zoneId="5805148" className="w-full min-h-[90px]" />
                </div>
              )}

              {/* Second batch of videos */}
              {displayVids.length > 8 && (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
                  {displayVids.slice(8, 16).map(v => <VideoCard key={v.id} video={v} />)}
                </div>
              )}

              {/* Ad Banners after 16 videos */}
              {displayVids.length > 16 && (
                <div className="my-4 sm:my-6 rounded-xl overflow-hidden bg-[#1a1a1a] border border-[#2a2a2a] p-2 sm:p-4 space-y-3">
                  <MyBidBanner bannerId="2015214" className="w-full min-h-[90px]" />
                  <AdBanner zoneId="5805148" className="w-full min-h-[90px]" />
                </div>
              )}

              {/* Remaining videos */}
              {displayVids.length > 16 && (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
                  {displayVids.slice(16).map(v => <VideoCard key={v.id} video={v} />)}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <Film className="w-16 h-16 text-gray-700" />
              <p className="text-gray-500">No videos found</p>
              <button onClick={() => handleSelect('category', null)} className="text-[#FF9000] hover:underline text-sm">Browse all videos</button>
            </div>
          )
        )}

        {/* Pagination - for both regular videos and search results */}
        {!viewMode && displayVids?.length ? (
          <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">
            <button
              onClick={() => {
                if (searchQuery) { setSearchPage(1) } else { setCurrentPage(1) }
                window.scrollTo(0, 0)
              }}
              disabled={(searchQuery ? searchPage : currentPage) === 1}
              className="px-4 py-2.5 bg-[#1a1a1a] text-white rounded-lg disabled:opacity-40 text-sm border border-[#2a2a2a] hover:bg-[#252525] transition-colors"
            >
              First
            </button>
            <button
              onClick={() => {
                if (searchQuery) { setSearchPage(p => Math.max(1, p - 1)) } else { setCurrentPage(p => Math.max(1, p - 1)) }
                window.scrollTo(0, 0)
              }}
              disabled={(searchQuery ? searchPage : currentPage) === 1}
              className="px-4 py-2.5 bg-[#1a1a1a] text-white rounded-lg disabled:opacity-40 flex items-center gap-1.5 border border-[#2a2a2a] hover:bg-[#252525] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />Prev
            </button>

            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              const activePage = searchQuery ? searchPage : currentPage
              const num = activePage <= 3 ? i + 1 : activePage - 2 + i
              if (num < 1 || num > totalPages) return null
              return (
                <button
                  key={num}
                  onClick={() => {
                    if (searchQuery) { setSearchPage(num) } else { setCurrentPage(num) }
                    window.scrollTo(0, 0)
                  }}
                  className={`w-11 h-11 rounded-lg text-sm font-medium transition-all ${activePage === num ? 'bg-[#FF9000] text-black shadow-lg shadow-[#FF9000]/20' : 'bg-[#1a1a1a] text-white hover:bg-[#252525] border border-[#2a2a2a]'}`}
                >
                  {num}
                </button>
              )
            })}

            {totalPages > 5 && <span className="text-gray-600 px-2">...</span>}

            <button
              onClick={() => {
                if (searchQuery) { setSearchPage(p => Math.min(totalPages, p + 1)) } else { setCurrentPage(p => Math.min(totalPages, p + 1)) }
                window.scrollTo(0, 0)
              }}
              disabled={(searchQuery ? searchPage : currentPage) >= totalPages}
              className="px-5 py-2.5 bg-[#FF9000] text-black font-semibold rounded-lg flex items-center gap-1.5 shadow-lg shadow-[#FF9000]/20 hover:bg-[#FFa020] transition-colors disabled:opacity-50"
            >
              Next<ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : null}
      </main>

      <SiteFooter />
    </div>
  )
}
