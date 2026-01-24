'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  hasMore: boolean
  onPageChange: (page: number) => void
  maxPages?: number
}

export default function Pagination({ currentPage, hasMore, onPageChange, maxPages }: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = []

    // Always show first page
    pages.push(1)

    // Calculate range around current page
    const start = Math.max(2, currentPage - 1)
    const end = maxPages ? Math.min(maxPages - 1, currentPage + 1) : currentPage + 1

    if (start > 2) {
      pages.push('...')
    }

    // Show pages around current
    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) pages.push(i)
    }

    // Show ellipsis if we suspect there are more pages but don't know the max
    if (hasMore && !maxPages) {
      // Just show next page number if generated, logic above handles it
      // But if we are at the end of known pages, maybe show '...'?
      // Let's just rely on the pages array.
      // Actually without maxPages, we don't know if we should show '...' at the end.
      // But if hasMore is true, we imply there is more.
    }

    if (maxPages && end < maxPages - 1) {
      pages.push('...')
    }

    // Show last page if known
    if (maxPages && maxPages > 1 && !pages.includes(maxPages)) {
      pages.push(maxPages)
    }

    return pages
  }

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (hasMore) {
      onPageChange(currentPage + 1)
    }
  }

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number' && page !== currentPage) {
      onPageChange(page)
    }
  }

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      {/* Previous Button */}
      <button
        onClick={handlePrev}
        disabled={currentPage <= 1}
        className="flex items-center gap-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-2 py-2 text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={`page-${page}`}
              onClick={() => handlePageClick(page)}
              disabled={currentPage === page}
              className={`min-w-[40px] py-2 rounded-lg font-medium transition-all ${currentPage === page
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white cursor-default'
                : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                }`}
              aria-label={`Go to page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          )
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={!hasMore}
        className="flex items-center gap-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
