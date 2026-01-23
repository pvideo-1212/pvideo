'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { Search, X, User, TrendingUp, Star, Sparkles, Tag, Film, Grid3X3 } from 'lucide-react'
import modelsData from '@/models.json'
import { CATEGORY_KEYWORDS, TRENDING_KEYWORDS, getPopularSearches } from '@/lib/seo-keywords'

interface Model {
  name: string
  image: string | null
  videoCount: number
}

type SuggestionType = 'model' | 'category' | 'keyword'

interface Suggestion {
  type: SuggestionType
  value: string
  label: string
  image?: string | null
  videoCount?: number
  score: number
}

interface SearchSuggestionsProps {
  className?: string
  placeholder?: string
  onSearch?: (value: string, type?: SuggestionType) => void
  initialValue?: string
}

// Get top models sorted by video count (most popular)
const topModels: Model[] = (modelsData.models as Model[])
  .filter(m => m.videoCount > 50)
  .sort((a, b) => b.videoCount - a.videoCount)
  .slice(0, 100)

// Get categories from the SEO keywords
const categories = Object.keys(CATEGORY_KEYWORDS).map(cat => ({
  name: cat.charAt(0).toUpperCase() + cat.slice(1),
  key: cat
}))

// Get popular searches for quick access
const popularSearches = getPopularSearches()

// Get trending keywords for suggestions
const trendingTerms = TRENDING_KEYWORDS.slice(0, 20)

export function SearchSuggestions({
  className = '',
  placeholder = 'Search models, categories...',
  onSearch,
  initialValue = ''
}: SearchSuggestionsProps) {
  const [query, setQuery] = useState(initialValue)
  const [isFocused, setIsFocused] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [activeTab, setActiveTab] = useState<'all' | 'models' | 'categories'>('all')
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Combined search across models, categories, and keywords
  const suggestions = useMemo(() => {
    const results: Suggestion[] = []
    const searchTerm = query.toLowerCase().trim()

    if (!searchTerm) {
      // When empty, show popular models and categories
      topModels.slice(0, 4).forEach((model, idx) => {
        results.push({
          type: 'model',
          value: model.name,
          label: model.name,
          image: model.image,
          videoCount: model.videoCount,
          score: 100 - idx
        })
      })

      categories.slice(0, 4).forEach((cat, idx) => {
        results.push({
          type: 'category',
          value: cat.key,
          label: cat.name,
          score: 90 - idx
        })
      })

      return results.sort((a, b) => b.score - a.score)
    }

    // Search models
    topModels.forEach(model => {
      const name = model.name.toLowerCase()
      let score = 0

      if (name === searchTerm) score = 100
      else if (name.startsWith(searchTerm)) score = 80
      else if (name.split(' ')[0].startsWith(searchTerm)) score = 70
      else if (name.split(' ').slice(1).some(n => n.startsWith(searchTerm))) score = 60
      else if (name.includes(searchTerm)) score = 50
      else {
        // Fuzzy matching
        const letters = searchTerm.split('')
        let matchCount = 0
        let lastIndex = -1
        for (const letter of letters) {
          const idx = name.indexOf(letter, lastIndex + 1)
          if (idx > lastIndex) {
            matchCount++
            lastIndex = idx
          }
        }
        if (matchCount >= searchTerm.length * 0.7) {
          score = 30 + (matchCount / searchTerm.length) * 10
        }
      }

      if (score > 0) {
        score += Math.min(model.videoCount / 50, 10)
        results.push({
          type: 'model',
          value: model.name,
          label: model.name,
          image: model.image,
          videoCount: model.videoCount,
          score
        })
      }
    })

    // Search categories
    categories.forEach(cat => {
      const name = cat.name.toLowerCase()
      const key = cat.key.toLowerCase()
      let score = 0

      if (name === searchTerm || key === searchTerm) score = 95
      else if (name.startsWith(searchTerm) || key.startsWith(searchTerm)) score = 75
      else if (name.includes(searchTerm) || key.includes(searchTerm)) score = 45

      if (score > 0) {
        results.push({
          type: 'category',
          value: cat.key,
          label: cat.name,
          score
        })
      }
    })

    // Search popular keywords
    popularSearches.forEach(keyword => {
      const kw = keyword.toLowerCase()
      let score = 0

      if (kw === searchTerm) score = 85
      else if (kw.startsWith(searchTerm)) score = 65
      else if (kw.includes(searchTerm)) score = 35

      if (score > 0) {
        // Check if not already added as category
        if (!categories.some(c => c.key === keyword)) {
          results.push({
            type: 'keyword',
            value: keyword,
            label: keyword.charAt(0).toUpperCase() + keyword.slice(1),
            score
          })
        }
      }
    })

    // Sort by score and limit
    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
  }, [query])

  // Filter by active tab
  const filteredSuggestions = useMemo(() => {
    if (activeTab === 'all') return suggestions
    if (activeTab === 'models') return suggestions.filter(s => s.type === 'model')
    if (activeTab === 'categories') return suggestions.filter(s => s.type === 'category' || s.type === 'keyword')
    return suggestions
  }, [suggestions, activeTab])

  const showSuggestions = isFocused && filteredSuggestions.length > 0

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showSuggestions) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev =>
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && filteredSuggestions[selectedIndex]) {
          handleSelectSuggestion(filteredSuggestions[selectedIndex])
        } else if (query.trim()) {
          onSearch?.(query.trim())
        }
        break
      case 'Escape':
        setIsFocused(false)
        inputRef.current?.blur()
        break
      case 'Tab':
        // Cycle through tabs
        e.preventDefault()
        setActiveTab(prev => {
          if (prev === 'all') return 'models'
          if (prev === 'models') return 'categories'
          return 'all'
        })
        break
    }
  }, [showSuggestions, selectedIndex, filteredSuggestions, query, onSearch])

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    setQuery(suggestion.label)
    setIsFocused(false)
    setSelectedIndex(-1)
    onSearch?.(suggestion.value, suggestion.type)
  }

  const handleClear = () => {
    setQuery('')
    setSelectedIndex(-1)
    inputRef.current?.focus()
    onSearch?.('')
  }

  useEffect(() => {
    setSelectedIndex(-1)
  }, [query, activeTab])

  const getIcon = (type: SuggestionType) => {
    switch (type) {
      case 'model': return <User className="w-4 h-4 text-[#FF9000]" />
      case 'category': return <Grid3X3 className="w-4 h-4 text-purple-400" />
      case 'keyword': return <Tag className="w-4 h-4 text-blue-400" />
    }
  }

  const getTypeLabel = (type: SuggestionType) => {
    switch (type) {
      case 'model': return 'Model'
      case 'category': return 'Category'
      case 'keyword': return 'Search'
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-11 pr-10 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FF9000] transition-colors"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-xl overflow-hidden z-[60]">
          {/* Tab Filters */}
          <div className="flex border-b border-[#2a2a2a]">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${activeTab === 'all'
                  ? 'text-[#FF9000] border-b-2 border-[#FF9000] bg-[#FF9000]/5'
                  : 'text-gray-400 hover:text-white'
                }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('models')}
              className={`flex-1 px-3 py-2 text-xs font-medium transition-colors flex items-center justify-center gap-1 ${activeTab === 'models'
                  ? 'text-[#FF9000] border-b-2 border-[#FF9000] bg-[#FF9000]/5'
                  : 'text-gray-400 hover:text-white'
                }`}
            >
              <User className="w-3 h-3" />
              Models
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex-1 px-3 py-2 text-xs font-medium transition-colors flex items-center justify-center gap-1 ${activeTab === 'categories'
                  ? 'text-[#FF9000] border-b-2 border-[#FF9000] bg-[#FF9000]/5'
                  : 'text-gray-400 hover:text-white'
                }`}
            >
              <Grid3X3 className="w-3 h-3" />
              Categories
            </button>
          </div>

          {/* Header */}
          <div className="px-4 py-2 border-b border-[#2a2a2a] flex items-center gap-2">
            {query.trim() ? (
              <>
                <Search className="w-3.5 h-3.5 text-[#FF9000]" />
                <span className="text-xs text-gray-400">
                  {filteredSuggestions.length} results for "{query}"
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#FF9000]" />
                <span className="text-xs text-gray-400">Popular Suggestions</span>
              </>
            )}
          </div>

          {/* Suggestions List */}
          <div className="max-h-[320px] overflow-y-auto overscroll-contain">
            {filteredSuggestions.map((suggestion, index) => {
              const href = suggestion.type === 'model'
                ? `/pornstars/${encodeURIComponent(suggestion.value.toLowerCase().replace(/\s+/g, '-'))}`
                : suggestion.type === 'category'
                  ? `/?category=${encodeURIComponent(suggestion.value)}`
                  : `/?search=${encodeURIComponent(suggestion.value)}`

              return (
                <Link
                  key={`${suggestion.type}-${suggestion.value}`}
                  href={href}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${index === selectedIndex
                      ? 'bg-[#FF9000]/10 text-white'
                      : 'hover:bg-white/5 text-gray-300 hover:text-white'
                    }`}
                >
                  {/* Avatar/Icon */}
                  {suggestion.type === 'model' ? (
                    <div className="w-10 h-10 rounded-full bg-[#2a2a2a] overflow-hidden shrink-0 flex items-center justify-center">
                      {suggestion.image ? (
                        <img
                          src={suggestion.image}
                          alt=""
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <User className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#2a2a2a] shrink-0 flex items-center justify-center">
                      {getIcon(suggestion.type)}
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{suggestion.label}</div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${suggestion.type === 'model' ? 'bg-[#FF9000]/20 text-[#FF9000]' :
                          suggestion.type === 'category' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-blue-500/20 text-blue-400'
                        }`}>
                        {getTypeLabel(suggestion.type)}
                      </span>
                      {suggestion.videoCount && (
                        <span className="flex items-center gap-1">
                          <Film className="w-3 h-3" />
                          {suggestion.videoCount} videos
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Trending indicator */}
                  {suggestion.type === 'model' && topModels.slice(0, 10).some(m => m.name === suggestion.value) && (
                    <div className="shrink-0">
                      <TrendingUp className="w-4 h-4 text-[#FF9000]" />
                    </div>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Footer hint */}
          <div className="px-4 py-2 border-t border-[#2a2a2a] text-[10px] text-gray-500 flex items-center justify-between">
            <span>↑↓ Navigate</span>
            <span>Tab Switch</span>
            <span>↵ Select</span>
          </div>
        </div>
      )}

      {/* No results */}
      {isFocused && query.trim() && filteredSuggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-xl overflow-hidden z-[60] p-6 text-center">
          <Search className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-400 mb-1">No results for "{query}"</p>
          <p className="text-xs text-gray-500 mb-3">Try a different search term</p>

          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-2 justify-center">
            {popularSearches.slice(0, 5).map(term => (
              <button
                key={term}
                onClick={() => {
                  setQuery(term)
                  onSearch?.(term, 'keyword')
                }}
                className="px-3 py-1 bg-[#2a2a2a] rounded-full text-xs text-gray-300 hover:bg-[#FF9000]/20 hover:text-[#FF9000] transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchSuggestions
