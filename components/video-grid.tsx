"use client"

import { useMemo, useEffect, useState } from "react"
import VideoCard from "./video-card"
import { videoDb } from "@/lib/db"
import { Loader2 } from "lucide-react"

interface VideoGridProps {
  category: string
  searchQuery: string
  sortBy?: string
  minRating?: number
}

export default function VideoGrid({ category, searchQuery, sortBy = "newest", minRating = 0 }: VideoGridProps) {
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadVideos()
  }, [])

  const loadVideos = async () => {
    try {
      const data = await videoDb.getAll()
      setVideos(data)
    } catch (error) {
      console.error("Failed to load videos:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAndSortedVideos = useMemo(() => {
    const filtered = videos.filter((video) => {
      const matchesCategory = category === "all" || video.category === category
      const matchesSearch =
        searchQuery === "" ||
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.tags?.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesRating = video.rating >= minRating
      return matchesCategory && matchesSearch && matchesRating
    })

    switch (sortBy) {
      case "oldest":
        return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      case "most-viewed":
        return filtered.sort((a, b) => b.views - a.views)
      case "highest-rated":
        return filtered.sort((a, b) => b.rating - a.rating)
      case "lowest-rated":
        return filtered.sort((a, b) => a.rating - b.rating)
      case "newest":
      default:
        return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }
  }, [videos, category, searchQuery, sortBy, minRating])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading videos...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Results count */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          <span className="font-semibold text-foreground">{filteredAndSortedVideos.length}</span>
          {' '}video{filteredAndSortedVideos.length !== 1 ? "s" : ""}
          {searchQuery && <span> for "<span className="text-primary">{searchQuery}</span>"</span>}
          {category !== "all" && <span> in <span className="text-primary capitalize">{category}</span></span>}
        </p>
      </div>

      {/* Video grid - Responsive: 1 col mobile, 2 col tablet, 3 col desktop, 4 col 2K/4K */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        {filteredAndSortedVideos.map((video, index) => (
          <div
            key={video.id}
            className="animate-in fade-in slide-in-from-bottom-4"
            style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
          >
            <VideoCard video={video} />
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredAndSortedVideos.length === 0 && (
        <div className="text-center py-16 px-4">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <svg className="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No videos found</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            We couldn't find any videos matching your criteria. Try adjusting your filters or search query.
          </p>
        </div>
      )}
    </div>
  )
}
