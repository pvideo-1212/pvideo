"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Play, Eye, Star, Clock } from "lucide-react"
import { videoDb } from "@/lib/db"
import Image from "next/image"

interface RelatedVideosProps {
  currentVideoId: string
}

export default function RelatedVideos({ currentVideoId }: RelatedVideosProps) {
  const [relatedVideos, setRelatedVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRelatedVideos()
  }, [currentVideoId])

  const loadRelatedVideos = async () => {
    try {
      const videos = await videoDb.getAll()
      const filtered = videos.filter((video) => video.id !== currentVideoId).slice(0, 5)
      setRelatedVideos(filtered)
    } catch (error) {
      console.error("Failed to load related videos:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-4 sticky top-24">
        <h3 className="font-bold text-foreground mb-4">Related Videos</h3>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-video bg-muted rounded-lg mb-2" />
              <div className="h-4 bg-muted rounded w-3/4 mb-1" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden sticky top-24 shadow-sm">
      <div className="p-4 border-b border-border bg-muted/30">
        <h3 className="font-bold text-foreground">Up Next</h3>
      </div>

      <div className="p-3 space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
        {relatedVideos.map((video, index) => (
          <Link key={video.id} href={`/video/${video.id}`}>
            <div className="group cursor-pointer rounded-lg overflow-hidden hover:bg-muted/50 transition-colors p-2">
              <div className="flex gap-3">
                {/* Thumbnail */}
                <div className="relative w-40 shrink-0 aspect-video bg-muted rounded-lg overflow-hidden">
                  <Image
                    width={160}
                    height={90}
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />

                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                      <Play className="w-4 h-4 text-primary fill-primary ml-0.5" />
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs font-medium px-1.5 py-0.5 rounded">
                    {video.duration}
                  </div>

                  {/* Number badge */}
                  <div className="absolute top-1 left-1 w-5 h-5 rounded bg-black/60 text-white text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 py-0.5">
                  <h4 className="text-sm font-medium text-foreground line-clamp-2 mb-1.5 group-hover:text-primary transition-colors leading-snug">
                    {video.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-2">{video.instructor}</p>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {(video.views / 1000).toFixed(1)}K
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      {video.rating}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {relatedVideos.length > 0 && (
        <div className="p-3 border-t border-border">
          <Link href="/" className="block text-center text-sm text-primary font-medium hover:underline">
            Browse All Videos
          </Link>
        </div>
      )}
    </div>
  )
}
