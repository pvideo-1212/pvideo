"use client"

import Link from "next/link"
import { Play, Eye, Star, Clock, Bookmark } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface VideoCardProps {
  video: {
    id: string
    title: string
    thumbnail: string
    duration: string
    views: number
    rating: number
    category: string
    instructor: string
    date: string
    isFeatured?: boolean
  }
}

export default function VideoCard({ video }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsSaved(!isSaved)
  }

  return (
    <Link href={`/video/${video.id}`}>
      <div
        className="group cursor-pointer card-hover"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl">
          {/* Thumbnail Container */}
          <div className="relative aspect-video bg-muted overflow-hidden">
            <Image
              width={400}
              height={225}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              src={video.thumbnail}
              unoptimized
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`
                bg-primary text-primary-foreground rounded-full p-4 
                transform transition-all duration-300 shadow-lg
                ${isHovered ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}
              `}>
                <Play className="w-6 h-6 fill-current" />
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className={`
                absolute top-3 left-3 p-2 rounded-lg backdrop-blur-sm transition-all duration-300
                ${isSaved
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-black/40 text-white hover:bg-black/60'
                }
                ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
              `}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>

            {/* Duration Badge */}
            <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {video.duration}
            </div>

            {/* Rating Badge */}
            <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-orange-600 text-black text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-lg">
              <Star className="w-3 h-3 fill-current" />
              {video.rating}%
            </div>

            {/* Featured Badge */}
            {video.isFeatured && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                FEATURED
              </div>
            )}

            {/* Progress Bar (mock) */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
              <div
                className="h-full bg-primary transition-all duration-1000"
                style={{ width: isHovered ? '30%' : '0%' }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
              {video.title}
            </h3>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold shrink-0">
                {video.instructor.charAt(0)}
              </div>
              <p className="text-sm text-muted-foreground truncate">{video.instructor}</p>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>{video.views.toLocaleString()} views</span>
              </div>
              <span className="px-2 py-0.5 bg-muted rounded text-xs font-medium capitalize">
                {video.category}
              </span>
            </div>
          </div>

          {/* Shine effect on hover */}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
              style={{
                transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
                transition: 'transform 0.6s ease',
              }}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}
