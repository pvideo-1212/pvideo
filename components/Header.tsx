'use client'

import { useState, FormEvent, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Menu, X } from 'lucide-react'

interface HeaderProps {
  onSearch?: (query: string) => void
  initialQuery?: string
}

export default function Header({ onSearch, initialQuery = '' }: HeaderProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Sync query with initialQuery prop when it changes
  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmedQuery = query.trim()

    if (onSearch) {
      onSearch(trimmedQuery)
    } else {
      // Fallback: navigate directly if no onSearch provided
      if (trimmedQuery) {
        router.push(`/?q=${encodeURIComponent(trimmedQuery)}&page=1`)
      } else {
        router.push('/')
      }
    }

    setIsMenuOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-black/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              TubeX
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSubmit} className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Search videos..."
                aria-label="Search videos"
                className="w-full px-4 py-2.5 pl-11 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Search
              </button>
            </div>
          </form>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/models" className="text-gray-300 hover:text-purple-400 transition-colors">
              Models
            </Link>
            <Link href="/channels" className="text-gray-300 hover:text-cyan-400 transition-colors">
              Channels
            </Link>
            <Link href="/categories" className="text-gray-300 hover:text-emerald-400 transition-colors">
              Categories
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Search & Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 space-y-4">
            <form onSubmit={handleSubmit}>
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={handleInputChange}
                  placeholder="Search videos..."
                  aria-label="Search videos"
                  className="w-full px-4 py-3 pl-11 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg text-white text-sm font-medium"
                >
                  Go
                </button>
              </div>
            </form>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="py-2 text-gray-300 hover:text-white" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link href="/models" className="py-2 text-gray-300 hover:text-purple-400" onClick={() => setIsMenuOpen(false)}>
                Models
              </Link>
              <Link href="/channels" className="py-2 text-gray-300 hover:text-cyan-400" onClick={() => setIsMenuOpen(false)}>
                Channels
              </Link>
              <Link href="/categories" className="py-2 text-gray-300 hover:text-emerald-400" onClick={() => setIsMenuOpen(false)}>
                Categories
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header >
  )
}
