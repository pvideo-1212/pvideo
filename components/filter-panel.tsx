"use client"

import { X, Star, SortAsc, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface FilterPanelProps {
  sortBy: string
  onSortChange: (value: string) => void
  minRating: number
  onRatingChange: (value: number) => void
  onClose: () => void
}

export default function FilterPanel({
  sortBy,
  onSortChange,
  minRating,
  onRatingChange,
  onClose,
}: FilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    sort: true,
    rating: true,
    duration: false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "most-viewed", label: "Most Viewed" },
    { value: "highest-rated", label: "Highest Rated" },
    { value: "lowest-rated", label: "Lowest Rated" },
  ]

  const ratingOptions = [
    { value: 0, label: "All Ratings" },
    { value: 90, label: "90% & Above" },
    { value: 80, label: "80% & Above" },
    { value: 70, label: "70% & Above" },
  ]

  const durationOptions = [
    { value: "any", label: "Any Duration" },
    { value: "short", label: "Under 30 min" },
    { value: "medium", label: "30-60 min" },
    { value: "long", label: "Over 60 min" },
  ]

  const handleReset = () => {
    onSortChange("newest")
    onRatingChange(0)
  }

  const hasActiveFilters = sortBy !== "newest" || minRating > 0

  return (
    <div className="w-72 bg-card border border-border rounded-xl shadow-lg overflow-hidden sticky top-24">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between">
        <h3 className="font-bold text-foreground flex items-center gap-2">
          <SortAsc className="w-5 h-5 text-primary" />
          Filters
        </h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-lg">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Sort By Section */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('sort')}
            className="w-full flex items-center justify-between text-sm font-semibold text-foreground"
          >
            Sort By
            <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.sort ? 'rotate-180' : ''}`} />
          </button>

          {expandedSections.sort && (
            <div className="space-y-1">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onSortChange(option.value)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${sortBy === option.value
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-border" />

        {/* Rating Section */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('rating')}
            className="w-full flex items-center justify-between text-sm font-semibold text-foreground"
          >
            <span className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              Minimum Rating
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.rating ? 'rotate-180' : ''}`} />
          </button>

          {expandedSections.rating && (
            <div className="space-y-1">
              {ratingOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onRatingChange(option.value)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2 ${minRating === option.value
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                    }`}
                >
                  {option.value > 0 && (
                    <span className="flex">
                      {Array.from({ length: Math.floor(option.value / 20) }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current text-yellow-500" />
                      ))}
                    </span>
                  )}
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-border" />

        {/* Duration Section */}
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('duration')}
            className="w-full flex items-center justify-between text-sm font-semibold text-foreground"
          >
            Duration
            <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.duration ? 'rotate-180' : ''}`} />
          </button>

          {expandedSections.duration && (
            <div className="space-y-1">
              {durationOptions.map((option) => (
                <button
                  key={option.value}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted transition-colors"
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      {hasActiveFilters && (
        <div className="p-4 border-t border-border bg-muted/30">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleReset}
          >
            Reset All Filters
          </Button>
        </div>
      )}
    </div>
  )
}
