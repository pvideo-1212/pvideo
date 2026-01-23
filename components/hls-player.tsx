'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Maximize, Minimize, Loader2, Shield, RefreshCw, Volume2, VolumeX, AlertCircle } from 'lucide-react'

interface HLSPlayerProps {
  videoId: string
  title: string
  thumbnail?: string
  onError?: () => void
}

export function HLSPlayer({ videoId, title, thumbnail }: HLSPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [showPlayer, setShowPlayer] = useState(false)
  const [embedFailed, setEmbedFailed] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [loadTimeout, setLoadTimeout] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Use our local wrapper API for better mobile compatibility and control
  const embedUrl = `/api/eporner/embed/${videoId}`

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handlePlay = () => {
    setShowPlayer(true)
    setIsLoading(true)
    setEmbedFailed(false)
    setLoadTimeout(false)

    // Set timeout for mobile - if takes too long, show VPN message
    const timeout = setTimeout(() => {
      if (isLoading) {
        setLoadTimeout(true)
      }
    }, 12000) // 12 seconds timeout

    return () => clearTimeout(timeout)
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
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
      // Fallback for iOS - open in new tab
      if (isMobile) {
        window.open(embedUrl, '_blank')
      }
    }
  }

  const handleRetry = () => {
    setEmbedFailed(false)
    setLoadTimeout(false)
    setIsLoading(true)
    // Force iframe reload
    if (iframeRef.current) {
      iframeRef.current.src = embedUrl + '?t=' + Date.now()
    }
  }

  const openInNewTab = () => {
    window.open(embedUrl, '_blank')
  }

  return (
    <div
      ref={containerRef}
      className={`relative bg-black overflow-hidden shadow-2xl ${isFullscreen ? '' : 'rounded-xl'}`}
    >
      {/* 16:9 Aspect Ratio Container */}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        {!showPlayer ? (
          // Thumbnail with play button - Mobile optimized
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
              className="absolute inset-0 flex items-center justify-center z-10 bg-black/40 active:bg-black/60 transition-colors cursor-pointer touch-manipulation"
            >
              <div className={`${isMobile ? 'w-16 h-16' : 'w-20 h-20'} bg-[#FF9000] rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-lg shadow-[#FF9000]/30`}>
                <Play className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} text-black ml-1`} fill="currentColor" />
              </div>
            </button>

            {/* Mobile-friendly fullscreen hint */}
            {isMobile && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/70 rounded-full text-xs text-white/80">
                Tap to play
              </div>
            )}
          </>
        ) : (embedFailed || loadTimeout) ? (
          // VPN Required Banner - Mobile optimized
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#0d0d0d] p-4 sm:p-6 text-center overflow-y-auto">
            <div className={`${isMobile ? 'w-14 h-14' : 'w-20 h-20'} bg-gradient-to-br from-[#FF9000] to-[#FF6000] rounded-full flex items-center justify-center mb-4 sm:mb-6 shrink-0`}>
              {loadTimeout ? (
                <AlertCircle className={`${isMobile ? 'w-7 h-7' : 'w-10 h-10'} text-white`} />
              ) : (
                <Shield className={`${isMobile ? 'w-7 h-7' : 'w-10 h-10'} text-white`} />
              )}
            </div>

            <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-white mb-2`}>
              {loadTimeout ? 'Video Loading Slowly' : 'VPN Required'}
            </h3>
            <p className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'} mb-4 max-w-sm px-2`}>
              {loadTimeout
                ? 'The video is taking too long to load. Try using a VPN or open in new tab.'
                : 'This video requires a VPN to play in your region.'}
            </p>

            {/* Compact steps for mobile */}
            <div className="bg-[#FF9000]/10 border border-[#FF9000]/30 rounded-xl p-3 sm:p-4 mb-4 max-w-sm w-full shrink-0">
              <h4 className="text-[#FF9000] font-semibold text-xs sm:text-sm mb-2">How to watch:</h4>
              <ol className={`text-gray-300 ${isMobile ? 'text-xs' : 'text-sm'} text-left space-y-1.5`}>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF9000] font-bold">1.</span>
                  <span>Install VPN (NordVPN, ExpressVPN)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF9000] font-bold">2.</span>
                  <span>Connect to USA/UK/EU server</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF9000] font-bold">3.</span>
                  <span>Tap refresh or open in new tab</span>
                </li>
              </ol>
            </div>

            {/* Action buttons - stacked on mobile */}
            <div className={`flex ${isMobile ? 'flex-col w-full max-w-xs' : 'flex-row'} gap-2 sm:gap-3`}>
              <button
                onClick={handleRetry}
                className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#FF9000] to-[#FF6000] text-black font-semibold rounded-full active:scale-95 transition-transform shadow-lg ${isMobile ? 'text-sm' : ''}`}
              >
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                Refresh
              </button>
              <button
                onClick={openInNewTab}
                className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#2c2c2c] text-white font-semibold rounded-full active:scale-95 transition-colors border border-[#3c3c3c] ${isMobile ? 'text-sm' : ''}`}
              >
                Open in New Tab
              </button>
            </div>
          </div>
        ) : (
          // Embed player - Direct eporner embed for better mobile compatibility
          <>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} text-[#FF9000] animate-spin`} />
                  <span className={`text-white ${isMobile ? 'text-xs' : 'text-sm'}`}>Loading player...</span>
                  {isMobile && (
                    <button
                      onClick={openInNewTab}
                      className="mt-2 text-xs text-[#FF9000] underline"
                    >
                      Taking too long? Open in browser
                    </button>
                  )}
                </div>
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={embedUrl}
              className="absolute inset-0 w-full h-full"
              allowFullScreen
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope"
              frameBorder="0"
              scrolling="no"
              title={title}
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              style={{ border: 'none' }}
              // @ts-ignore - iOS specific attributes
              playsInline
              webkit-playsinline="true"
              loading="eager"
            />
            {/* Fullscreen button overlay - hidden on mobile as video has its own controls */}
            {!isMobile && (
              <button
                onClick={toggleFullscreen}
                className="absolute bottom-4 right-4 p-2 bg-black/60 hover:bg-black/80 rounded-lg transition-colors opacity-0 group-hover:opacity-100 z-20"
              >
                {isFullscreen ? <Minimize className="w-5 h-5 text-white" /> : <Maximize className="w-5 h-5 text-white" />}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
