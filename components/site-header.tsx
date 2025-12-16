"use client"

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Search, X, Menu, Home, Grid3X3, Tv, User, Shield } from 'lucide-react'

interface SiteHeaderProps {
  showSearch?: boolean
  searchValue?: string
  onSearchChange?: (value: string) => void
}

export default function SiteHeader({ showSearch = true, searchValue = '', onSearchChange }: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [localSearch, setLocalSearch] = useState(searchValue)
  const [showVpnBanner, setShowVpnBanner] = useState(false)

  useEffect(() => {
    // Check if banner was dismissed
    const dismissed = localStorage.getItem('vpn-banner-dismissed')
    if (!dismissed) {
      setShowVpnBanner(true)
    }
  }, [])

  const dismissBanner = () => {
    setShowVpnBanner(false)
    localStorage.setItem('vpn-banner-dismissed', 'true')
  }

  const handleSearch = (value: string) => {
    setLocalSearch(value)
    onSearchChange?.(value)
  }

  return (
    <>
      {/* VPN Banner */}
      {showVpnBanner && (
        <div className="bg-gradient-to-r from-[#FF9000] via-[#FFa030] to-[#FF9000] text-black py-2 px-4 relative">
          <div className="max-w-[1600px] mx-auto flex items-center justify-center gap-2 text-sm font-medium">
            <Shield className="w-4 h-4" />
            <span>🔒 Use a VPN for better experience and privacy</span>
            <a
              href="https://surfshark.com"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 px-3 py-1 bg-black text-white rounded-full text-xs font-bold hover:bg-gray-800 transition-colors"
            >
              Get VPN
            </a>
            <button
              onClick={dismissBanner}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-black/10 rounded-full transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-50 bg-[#0d0d0d]/95 backdrop-blur-md border-b border-[#1f1f1f]">
        <div className="max-w-[1600px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <span className="text-xl font-extrabold text-white tracking-tight">Porn</span>
              <span className="text-xl font-extrabold bg-[#FF9000] text-black px-1.5 py-0.5 rounded ml-0.5 tracking-tight">hub</span>
            </Link>

            {/* Search Bar - Desktop */}
            {showSearch && (
              <div className="flex-1 max-w-lg hidden md:block">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={localSearch}
                    onChange={e => handleSearch(e.target.value)}
                    placeholder="Search videos..."
                    className="w-full pl-11 pr-10 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FF9000] transition-colors"
                  />
                  {localSearch && (
                    <button
                      onClick={() => handleSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white p-1 rounded-full hover:bg-white/10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
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

          {/* Mobile Search */}
          {showSearch && (
            <div className="md:hidden mt-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={localSearch}
                  onChange={e => handleSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-11 pr-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FF9000]"
                />
              </div>
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
    </>
  )
}
