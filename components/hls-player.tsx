'use client'

import { useState, useRef } from 'react'
import { Play, Maximize, Loader2 } from 'lucide-react'

interface HLSPlayerProps {
  videoId: string
  title: string
  thumbnail?: string
  onError?: () => void
}

export function HLSPlayer({ videoId, title, thumbnail }: HLSPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showPlayer, setShowPlayer] = useState(false)

  // Embed URL for eporner's native player
  const embedUrl = `https://www.eporner.com/embed/${videoId}/`

  const handlePlay = () => {
    setShowPlayer(true)
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  const toggleFullscreen = () => {
    const container = containerRef.current
    if (!container) return

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      container.requestFullscreen()
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative bg-black rounded-xl overflow-hidden shadow-2xl group"
    >
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        {!showPlayer ? (
          // Thumbnail with play button
          <>
            {thumbnail && (
              <img
                src={thumbnail}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <button
              onClick={handlePlay}
              className="absolute inset-0 flex items-center justify-center z-10 bg-black/40 hover:bg-black/50 transition-colors cursor-pointer"
            >
              <div className="w-20 h-20 bg-[#FF9000] rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
                <Play className="w-10 h-10 text-black ml-1" fill="currentColor" />
              </div>
            </button>
            {/* Fullscreen button */}
            <button
              onClick={toggleFullscreen}
              className="absolute bottom-4 right-4 p-2 bg-black/60 hover:bg-black/80 rounded-lg transition-colors opacity-0 group-hover:opacity-100 z-20"
            >
              <Maximize className="w-5 h-5 text-white" />
            </button>
          </>
        ) : (
          // Iframe player
          <>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-12 h-12 text-[#FF9000] animate-spin" />
                  <span className="text-white text-sm">Loading player...</span>
                </div>
              </div>
            )}
            <iframe
              src={embedUrl}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              frameBorder="0"
              scrolling="no"
              title={title}
              onLoad={handleIframeLoad}
              style={{ border: 'none' }}
            />
          </>
        )}
      </div>
    </div>
  )
}
