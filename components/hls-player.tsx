'use client'

import { useState, useRef } from 'react'
import { Play, Maximize, Minimize, Loader2, Shield, RefreshCw } from 'lucide-react'

interface HLSPlayerProps {
  videoId: string
  title: string
  thumbnail?: string
  onError?: () => void
}

export function HLSPlayer({ videoId, title, thumbnail }: HLSPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [showPlayer, setShowPlayer] = useState(false)
  const [embedFailed, setEmbedFailed] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Use our own embed route which wraps Eporner embed
  const embedUrl = `/api/eporner/embed/${videoId}`

  const handlePlay = () => {
    setShowPlayer(true)
    setIsLoading(true)
    setEmbedFailed(false)
  }

  const handleIframeLoad = () => {
    setIsLoading(false)

    // Set a timeout to detect if the embed is working
    // If after 8 seconds and still loading state visible, show VPN banner
    setTimeout(() => {
      // Check if iframe content might be blocked
      try {
        if (iframeRef.current) {
          // We can't actually access cross-origin content, 
          // but we can detect loading issues via timeout
        }
      } catch {
        // Cross-origin, expected
      }
    }, 8000)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setEmbedFailed(true)
  }

  const toggleFullscreen = async () => {
    if (!containerRef.current) return

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
        setIsFullscreen(false)
      } else {
        await containerRef.current.requestFullscreen()
        setIsFullscreen(true)
      }
    } catch (error) {
      console.error('Fullscreen error:', error)
    }
  }

  const handleRetry = () => {
    setEmbedFailed(false)
    setIsLoading(true)
    // Force iframe reload
    if (iframeRef.current) {
      iframeRef.current.src = embedUrl
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
        ) : embedFailed ? (
          // VPN Required Banner
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#0d0d0d] p-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#FF9000] to-[#FF6000] rounded-full flex items-center justify-center mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>

            <h3 className="text-xl font-bold text-white mb-3">VPN Required</h3>
            <p className="text-gray-400 text-sm mb-6 max-w-sm">
              This video requires a VPN to play in your region. Connect to a VPN server outside India and try again.
            </p>

            <div className="bg-[#FF9000]/10 border border-[#FF9000]/30 rounded-xl p-4 mb-6 max-w-sm">
              <h4 className="text-[#FF9000] font-semibold text-sm mb-3">How to watch:</h4>
              <ol className="text-gray-300 text-sm text-left space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#FF9000] font-bold">1.</span>
                  Install a VPN browser extension
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF9000] font-bold">2.</span>
                  Connect to USA, UK, or EU server
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF9000] font-bold">3.</span>
                  Click the refresh button below
                </li>
              </ol>
            </div>

            <button
              onClick={handleRetry}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF9000] to-[#FF6000] text-black font-semibold rounded-full hover:scale-105 transition-transform shadow-lg"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh After VPN
            </button>
          </div>
        ) : (
          // Embed player
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
              ref={iframeRef}
              src={embedUrl}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              frameBorder="0"
              scrolling="no"
              title={title}
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              style={{ border: 'none' }}
              sandbox="allow-scripts allow-same-origin allow-presentation allow-fullscreen"
            />
            {/* Fullscreen button overlay */}
            <button
              onClick={toggleFullscreen}
              className="absolute bottom-4 right-4 p-2 bg-black/60 hover:bg-black/80 rounded-lg transition-colors opacity-0 group-hover:opacity-100 z-20"
            >
              {isFullscreen ? <Minimize className="w-5 h-5 text-white" /> : <Maximize className="w-5 h-5 text-white" />}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
