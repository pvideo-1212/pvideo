'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Play, Maximize, Minimize, Loader2, Shield, RefreshCw, AlertCircle, Volume2, VolumeX, Settings } from 'lucide-react'

interface VideoSource {
  src: string
  quality: string
  type: 'hls' | 'mp4' | 'embed'
  label: string
}

interface HLSPlayerProps {
  videoId: string
  title: string
  thumbnail?: string
  onError?: () => void
}

export function HLSPlayer({ videoId, title, thumbnail }: HLSPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const hlsRef = useRef<any>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [showPlayer, setShowPlayer] = useState(false)
  const [playerMode, setPlayerMode] = useState<'loading' | 'native' | 'embed' | 'error'>('loading')
  const [sources, setSources] = useState<VideoSource[]>([])
  const [selectedSource, setSelectedSource] = useState<VideoSource | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [retryCount, setRetryCount] = useState(0)

  // Embed URL as fallback
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

  // Fetch video sources when play is clicked
  const fetchSources = useCallback(async () => {
    try {
      console.log('[Player] Fetching sources for:', videoId)
      const response = await fetch(`/api/eporner/stream/${videoId}`)
      const data = await response.json()

      if (data.success && data.sources && data.sources.length > 0) {
        // Filter to get HLS or MP4 sources (not embed)
        const directSources = data.sources.filter((s: VideoSource) => s.type !== 'embed')

        if (directSources.length > 0) {
          // Transform URLs to go through our proxy
          const proxiedSources = directSources.map((s: VideoSource) => ({
            ...s,
            src: `/api/proxy/hls?url=${encodeURIComponent(s.src)}`
          }))

          setSources(proxiedSources)
          setSelectedSource(proxiedSources[0])
          return proxiedSources
        }
      }
      return null
    } catch (error) {
      console.error('[Player] Failed to fetch sources:', error)
      return null
    }
  }, [videoId])

  // Initialize HLS.js for m3u8 playback
  const initHls = useCallback(async (source: VideoSource) => {
    if (!videoRef.current) return false

    try {
      // Dynamically import HLS.js
      const Hls = (await import('hls.js')).default

      if (source.type === 'hls' && Hls.isSupported()) {
        // Cleanup previous instance
        if (hlsRef.current) {
          hlsRef.current.destroy()
        }

        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
          xhrSetup: (xhr: XMLHttpRequest) => {
            xhr.setRequestHeader('Accept', '*/*')
          }
        })

        hls.loadSource(source.src)
        hls.attachMedia(videoRef.current)

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('[Player] HLS manifest parsed, starting playback')
          videoRef.current?.play().catch(console.error)
          setIsLoading(false)
          setPlayerMode('native')
        })

        hls.on(Hls.Events.ERROR, (_: any, data: any) => {
          console.error('[Player] HLS error:', data)
          if (data.fatal) {
            hls.destroy()
            return false
          }
        })

        hlsRef.current = hls
        return true
      } else if (source.type === 'mp4' || videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        // Native playback for MP4 or Safari with native HLS
        videoRef.current.src = source.src
        await videoRef.current.play()
        setIsLoading(false)
        setPlayerMode('native')
        return true
      }
    } catch (error) {
      console.error('[Player] HLS init error:', error)
    }
    return false
  }, [])

  // Main play handler
  const handlePlay = async () => {
    setShowPlayer(true)
    setIsLoading(true)
    setPlayerMode('loading')
    setErrorMessage('')

    // Step 1: Try to get direct sources
    const directSources = await fetchSources()

    if (directSources && directSources.length > 0) {
      // Step 2: Try to play with HLS.js or native
      const success = await initHls(directSources[0])
      if (success) {
        return // Successfully playing with native player
      }
    }

    // Step 3: Fallback to embed player
    console.log('[Player] Falling back to embed player')
    setPlayerMode('embed')
    setIsLoading(true)

    // Set timeout for embed load
    setTimeout(() => {
      if (isLoading && playerMode === 'embed') {
        setPlayerMode('error')
        setErrorMessage('Video loading timed out. Please try with a VPN.')
      }
    }, 15000)
  }

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setPlayerMode('error')
    setErrorMessage('Failed to load video. Please try with a VPN.')
  }

  const handleRetry = async () => {
    setRetryCount(prev => prev + 1)

    if (retryCount < 2) {
      // Retry with direct sources
      handlePlay()
    } else {
      // Force embed mode
      setPlayerMode('embed')
      setIsLoading(true)
      if (iframeRef.current) {
        iframeRef.current.src = embedUrl + '?t=' + Date.now()
      }
    }
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
      if (isMobile) {
        window.open(embedUrl, '_blank')
      }
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(videoRef.current.muted)
    }
  }

  const openInNewTab = () => {
    window.open(`https://www.eporner.com/embed/${videoId}/`, '_blank')
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative bg-black overflow-hidden shadow-2xl group ${isFullscreen ? '' : 'rounded-xl'}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* 16:9 Aspect Ratio Container */}
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
              className="absolute inset-0 flex items-center justify-center z-10 bg-black/40 active:bg-black/60 transition-colors cursor-pointer touch-manipulation"
            >
              <div className={`${isMobile ? 'w-16 h-16' : 'w-20 h-20'} bg-[#FF9000] rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-lg shadow-[#FF9000]/30`}>
                <Play className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} text-black ml-1`} fill="currentColor" />
              </div>
            </button>

            {/* Proxy indicator */}
            <div className="absolute top-3 right-3 px-2 py-1 bg-black/70 rounded-full text-[10px] text-green-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              Proxy Enabled
            </div>

            {isMobile && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/70 rounded-full text-xs text-white/80">
                Tap to play (No VPN needed)
              </div>
            )}
          </>
        ) : playerMode === 'error' ? (
          // Error state
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#0d0d0d] p-4 sm:p-6 text-center">
            <div className={`${isMobile ? 'w-14 h-14' : 'w-20 h-20'} bg-gradient-to-br from-[#FF9000] to-[#FF6000] rounded-full flex items-center justify-center mb-4 shrink-0`}>
              <AlertCircle className={`${isMobile ? 'w-7 h-7' : 'w-10 h-10'} text-white`} />
            </div>

            <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-white mb-2`}>
              Connection Issue
            </h3>
            <p className={`text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'} mb-4 max-w-sm px-2`}>
              {errorMessage || 'Unable to connect to video server. Please try again.'}
            </p>

            <div className={`flex ${isMobile ? 'flex-col w-full max-w-xs' : 'flex-row'} gap-2 sm:gap-3`}>
              <button
                onClick={handleRetry}
                className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#FF9000] to-[#FF6000] text-black font-semibold rounded-full active:scale-95 transition-transform shadow-lg ${isMobile ? 'text-sm' : ''}`}
              >
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                Try Again
              </button>
              <button
                onClick={openInNewTab}
                className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#2c2c2c] text-white font-semibold rounded-full active:scale-95 transition-colors border border-[#3c3c3c] ${isMobile ? 'text-sm' : ''}`}
              >
                Open Direct Link
              </button>
            </div>
          </div>
        ) : playerMode === 'native' ? (
          // Native HTML5 video player
          <>
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full"
              controls
              playsInline
              autoPlay
              muted={isMuted}
              poster={thumbnail}
              onError={() => {
                console.log('[Player] Native video error, falling back to embed')
                setPlayerMode('embed')
              }}
            />

            {/* Quality indicator */}
            {selectedSource && (
              <div className={`absolute top-3 left-3 px-2 py-1 bg-green-500/80 rounded text-xs text-white font-medium transition-opacity ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                {selectedSource.quality} • Proxy Stream
              </div>
            )}
          </>
        ) : (
          // Embed player mode
          <>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} text-[#FF9000] animate-spin`} />
                  <span className={`text-white ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    {playerMode === 'loading' ? 'Finding best source...' : 'Loading player...'}
                  </span>
                  {isMobile && (
                    <button
                      onClick={openInNewTab}
                      className="mt-2 text-xs text-[#FF9000] underline"
                    >
                      Taking too long? Open directly
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
              // @ts-ignore
              playsInline
              webkit-playsinline="true"
              loading="eager"
            />
          </>
        )}
      </div>
    </div>
  )
}
