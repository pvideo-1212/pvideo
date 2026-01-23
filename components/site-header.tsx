"use client"

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Menu, Home, Grid3X3, Tv, User, Shield } from 'lucide-react'
import SearchSuggestions from './search-suggestions'

interface SiteHeaderProps {
  showSearch?: boolean
  searchValue?: string
  onSearchChange?: (value: string) => void
}

export default function SiteHeader({ showSearch = true, searchValue = '', onSearchChange }: SiteHeaderProps) {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showBanner, setShowBanner] = useState(true)

  const handleSearch = (value: string, type?: 'model' | 'category' | 'keyword') => {
    onSearchChange?.(value)

    if (!value) return

    // Route based on suggestion type
    if (type === 'model') {
      const slug = value.toLowerCase().replace(/\s+/g, '-')
      router.push(`/pornstars/${encodeURIComponent(slug)}`)
    } else if (type === 'category') {
      router.push(`/?category=${encodeURIComponent(value)}`)
    } else {
      // Default: search/keyword - go to home with search param
      router.push(`/?search=${encodeURIComponent(value)}`)
    }
  }

  return (
    <div className="sticky top-0 z-50">
      {/* VPN Banner - Compact on mobile */}
      {showSearch && showBanner && (
        <div className="relative bg-gradient-to-r from-[#FF9000] via-[#FFa030] to-[#FF9000] text-black py-1.5 sm:py-2 px-3 sm:px-4">
          <div className="max-w-[1600px] mx-auto flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium pr-6">
            <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="hidden sm:inline">🔒 Use a VPN for better experience and privacy</span>
            <span className="sm:hidden truncate">🔒 Use VPN for best experience</span>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-black/10 rounded-full"
            aria-label="Close banner"
          >
            <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>
      )}

      <header className="bg-[#0d0d0d]/95 backdrop-blur-md border-b border-[#1f1f1f]">
        <div className="max-w-[1600px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <span className="text-xl font-extrabold text-white tracking-tight">Porn</span>
              <span className="text-xl font-extrabold bg-[#FF9000] text-black px-1.5 py-0.5 rounded ml-0.5 tracking-tight">hub</span>
            </Link>

            {/* Search Bar with Smart Suggestions - Desktop */}
            {showSearch && (
              <div className="flex-1 max-w-lg hidden md:block">
                <SearchSuggestions
                  placeholder="Search models, categories..."
                  onSearch={handleSearch}
                  initialValue={searchValue}
                />
              </div>
            )}

            {/* Navigation Links - Desktop */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link href="/" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2">
                <Home className="w-4 h-4" />Home
              </Link>
              <Link href="/?view=categories" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2">
                <Grid3X3 className="w-4 h-4" />Categories
              </Link>
              <Link href="/?view=channels" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2">
                <Tv className="w-4 h-4" />Channels
              </Link>
              <Link href="/pornstars" className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2">
                <User className="w-4 h-4" />Models
              </Link>
            </nav>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Search with Smart Suggestions */}
          {showSearch && (
            <div className="md:hidden mt-3">
              <SearchSuggestions
                placeholder="Search models, categories..."
                onSearch={handleSearch}
                initialValue={searchValue}
              />
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 border-t border-[#1f1f1f] ${mobileMenuOpen ? 'max-h-60' : 'max-h-0 border-transparent'}`}>
          <nav className="px-4 py-3 space-y-1">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg">
              <Home className="w-5 h-5" />Home
            </Link>
            <Link href="/?view=categories" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg">
              <Grid3X3 className="w-5 h-5" />Categories
            </Link>
            <Link href="/?view=channels" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg">
              <Tv className="w-5 h-5" />Channels
            </Link>
            <Link href="/pornstars" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg">
              <User className="w-5 h-5" />Models
            </Link>
          </nav>
        </div>
      </header>
    </div>
  )
}

