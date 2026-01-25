'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Grid3X3, Search, ArrowRight, Tag } from 'lucide-react'
import Header from '@/components/Header'
import { LeaderboardAd, FooterAd } from '@/components/ad-banner'

export interface Category {
  name: string
  slug: string
  count: number
}

interface CategoriesClientProps {
  categories: Category[]
}

function getColor(name: string): string {
  const colors = [
    'from-pink-500 to-rose-500',
    'from-amber-500 to-orange-500',
    'from-lime-500 to-green-500',
    'from-emerald-500 to-teal-500',
    'from-cyan-500 to-blue-500',
    'from-indigo-500 to-violet-500',
    'from-purple-500 to-fuchsia-500',
    'from-red-500 to-pink-500',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

export default function CategoriesClient({ categories }: CategoriesClientProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <LeaderboardAd />

      <main className="container mx-auto px-4 py-8">


        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {filteredCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/search?q=${encodeURIComponent(category.name)}`}
              className="group relative block overflow-hidden rounded-2xl bg-surface-card border border-white/5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-500/30"
            >
              {/* Category Color Block */}
              <div className={`aspect-video w-full relative overflow-hidden bg-gradient-to-br ${getColor(category.name)}`}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white/90 drop-shadow-lg select-none">
                    {category.name.charAt(0)}
                  </span>
                </div>

                {/* Overlay effect */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors truncate">
                    {category.name}
                  </h3>
                  <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Tag className="w-3 h-3" />
                  <span>{category.count.toLocaleString()} videos</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* No Results */}
        {filteredCategories.length === 0 && (
          <div className="py-20 text-center">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-xl text-gray-400 mb-2">No categories found</p>
            <p className="text-gray-500">Try searching for something else</p>
          </div>
        )}
      </main>

      <FooterAd />
    </div>
  )
}
