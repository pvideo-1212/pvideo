'use client'

import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'
import { Play, Pause, Volume2, VolumeX, Maximize, Loader2, AlertCircle } from 'lucide-react'

interface HLSPlayerProps {
  videoId: string
  title: string
  thumbnail?: string
  onError?: () => void
}

export function HLSPlayer({ videoId, title, thumbnail, onError }: HLSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showControls, setShowControls] = useState(true)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [embedUrl, setEmbedUrl] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function loadVideo() {
      try {
        setIsLoading(true)
        setError(null)
        setEmbedUrl(null)

        // Fetch video sources from our API
        const res = await fetch(`/api/eporner/stream/${videoId}`)
        const data = await res.json()

        if (!data.success) {
          throw new Error(data.error || 'Failed to load video sources')
        }

        if (!mounted) return

        // Check if we have embed URL (most common case for India users)
        if (data.sources.embed) {
          console.log('[HLSPlayer] Using embed iframe')
          setEmbedUrl(data.sources.embed)
          setIsLoading(false)
          return
        }

        const video = videoRef.current
        if (!video) return

        // Try HLS sources first
        if (data.sources.hls && data.sources.hls.length > 0) {
          const hlsUrl = data.sources.hls[0]
          const proxiedUrl = `/api/proxy/hls?url=${encodeURIComponent(hlsUrl)}`

          if (Hls.isSupported()) {
            const hls = new Hls({
              xhrSetup: (xhr) => {
                xhr.withCredentials = false
              },
              maxBufferLength: 30,
              maxMaxBufferLength: 60,
            })

            hls.loadSource(proxiedUrl)
            hls.attachMedia(video)

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              if (mounted) {
                setIsLoading(false)
              }
            })

            hls.on(Hls.Events.ERROR, (event, data) => {
              if (data.fatal) {
                console.error('[HLS] Fatal error:', data.type, data.details)
                // Try MP4 fallback
                tryMP4Fallback()
              }
            })

            hlsRef.current = hls
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Safari native HLS
            video.src = proxiedUrl
            setIsLoading(false)
          }
        } else if (data.sources.mp4 && data.sources.mp4.length > 0) {
          // Use MP4 directly
          tryMP4Fallback()
        } else {
          throw new Error('No video sources available')
        }

        async function tryMP4Fallback() {
          if (!mounted || !video) return

          if (data.sources.mp4 && data.sources.mp4.length > 0) {
            // Proxy the MP4 through our server
            const mp4Url = data.sources.mp4[0]
            video.src = `/api/proxy/hls?url=${encodeURIComponent(mp4Url)}`
            setIsLoading(false)
          } else {
            setError('No playable video found')
            onError?.()
          }
        }

      } catch (err) {
        console.error('[HLSPlayer] Error:', err)
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load video')
          setIsLoading(false)
          onError?.()
        }
      }
    }

    loadVideo()

    return () => {
      mounted = false
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [videoId, onError])

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleTimeUpdate = () => {
      setProgress((video.currentTime / video.duration) * 100 || 0)
    }
    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }
    const handleWaiting = () => setIsLoading(true)
    const handlePlaying = () => setIsLoading(false)

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('waiting', handleWaiting)
    video.addEventListener('playing', handlePlaying)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('waiting', handleWaiting)
      video.removeEventListener('playing', handlePlaying)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      video.play()
    } else {
      video.pause()
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
    setIsMuted(video.muted)
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

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current
    if (!video || !duration) return

    const rect = e.currentTarget.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    video.currentTime = pos * duration
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div
      ref={containerRef}
      className="relative bg-black rounded-xl overflow-hidden shadow-2xl group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => !isLoading && setShowControls(false)}
    >
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        {/* Embed iframe - for India users where direct fetch doesn't work */}
        {embedUrl ? (
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture"
            frameBorder="0"
            scrolling="no"
            title={title}
          />
        ) : (
          <>
            {/* Thumbnail as poster */}
            {thumbnail && isLoading && (
              <img
                src={thumbnail}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* Video element */}
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full"
              playsInline
              onClick={togglePlay}
            />

            {/* Loading spinner */}
            {isLoading && !error && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-12 h-12 text-[#FF9000] animate-spin" />
                  <span className="text-white text-sm">Loading video...</span>
                </div>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] to-[#0d0d0d] z-10">
                <div className="text-center p-6 max-w-md">
                  <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Video Unavailable</h3>
                  <p className="text-gray-400 text-sm mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-[#FF9000] hover:bg-[#FFa020] text-black font-semibold rounded-full transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {/* Play button overlay */}
            {!isPlaying && !isLoading && !error && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center z-10 bg-black/30 hover:bg-black/40 transition-colors"
              >
                <div className="w-20 h-20 bg-[#FF9000] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <Play className="w-10 h-10 text-black ml-1" fill="currentColor" />
                </div>
              </button>
            )}

            {/* Controls */}
            {showControls && !error && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Progress bar */}
                <div
                  className="h-1 bg-white/30 rounded-full mb-3 cursor-pointer"
                  onClick={handleSeek}
                >
                  <div
                    className="h-full bg-[#FF9000] rounded-full relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full" />
                  </div>
                </div>

                {/* Control buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={togglePlay} className="p-2 hover:bg-white/20 rounded transition">
                      {isPlaying ? (
                        <Pause className="w-5 h-5 text-white" />
                      ) : (
                        <Play className="w-5 h-5 text-white" fill="currentColor" />
                      )}
                    </button>
                    <button onClick={toggleMute} className="p-2 hover:bg-white/20 rounded transition">
                      {isMuted ? (
                        <VolumeX className="w-5 h-5 text-white" />
                      ) : (
                        <Volume2 className="w-5 h-5 text-white" />
                      )}
                    </button>
                    <span className="text-white text-sm">
                      {formatTime(videoRef.current?.currentTime || 0)} / {formatTime(duration)}
                    </span>
                  </div>
                  <button onClick={toggleFullscreen} className="p-2 hover:bg-white/20 rounded transition">
                    <Maximize className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

