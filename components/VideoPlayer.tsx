'use client'

import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, Loader2, AlertCircle, RotateCcw } from 'lucide-react'
import type { VideoStream } from '@/lib/scraper/types'

interface VideoPlayerProps {
  streams: VideoStream[]
  thumbnail?: string
  title?: string
  embedUrl?: string // Fallback embed URL
}

export default function VideoPlayer({ streams, thumbnail, title, embedUrl }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const hlsRef = useRef<Hls | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(1)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [buffered, setBuffered] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedQuality, setSelectedQuality] = useState<string>('')
  const [showQualityMenu, setShowQualityMenu] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [useEmbed, setUseEmbed] = useState(false)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)

  // Sort streams by quality (highest first)
  const sortedStreams = [...streams].sort((a, b) => {
    const getQualityNum = (q: string) => parseInt(q.replace(/[^0-9]/g, '')) || 0
    return getQualityNum(b.quality) - getQualityNum(a.quality)
  })

  // Load source into player
  const loadSource = (stream: VideoStream) => {
    const video = videoRef.current
    if (!video) return

    setIsLoading(true)
    setError(null)

    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }

    if (stream.type === 'm3u8') {
      if (Hls.isSupported()) {
        const hls = new Hls({
          maxLoadingDelay: 4,
          maxBufferLength: 30,
          enableWorker: true,
          lowLatencyMode: false,
        })
        hlsRef.current = hls
        hls.loadSource(stream.url)
        hls.attachMedia(video)

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsLoading(false)
          video.play().catch(() => { })
        })

        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            console.error('HLS error:', data)
            if (embedUrl) {
              setUseEmbed(true)
            } else {
              setError('Failed to load video stream')
            }
            setIsLoading(false)
          }
        })
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari native HLS
        video.src = stream.url
      } else {
        setError('HLS not supported in this browser')
        setIsLoading(false)
      }
    } else {
      // MP4 direct playback
      video.src = stream.url
      video.load()
    }
  }

  // Initialize player
  useEffect(() => {
    if (sortedStreams.length === 0) {
      if (embedUrl) {
        setUseEmbed(true)
        setIsLoading(false)
      } else {
        setError('No video streams available')
        setIsLoading(false)
      }
      return
    }

    const defaultStream = sortedStreams[0]
    setSelectedQuality(defaultStream.quality)
    loadSource(defaultStream)

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
      }
    }
  }, [streams, embedUrl])

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
      setIsLoading(false)
    }
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
      // Update buffered
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1))
      }
    }
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleWaiting = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)
    const handleError = () => {
      if (embedUrl && !useEmbed) {
        setUseEmbed(true)
      } else {
        setError('Failed to load video')
      }
      setIsLoading(false)
    }
    const handleVolumeChange = () => {
      setVolume(video.volume)
      setIsMuted(video.muted)
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('waiting', handleWaiting)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('error', handleError)
    video.addEventListener('volumechange', handleVolumeChange)

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('waiting', handleWaiting)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('error', handleError)
      video.removeEventListener('volumechange', handleVolumeChange)
    }
  }, [embedUrl, useEmbed])

  // Controls visibility with timeout
  useEffect(() => {
    let timeout: NodeJS.Timeout
    const container = containerRef.current
    if (!container) return

    const showControlsHandler = () => {
      setShowControls(true)
      clearTimeout(timeout)
      if (isPlaying) {
        timeout = setTimeout(() => setShowControls(false), 3000)
      }
    }

    container.addEventListener('mousemove', showControlsHandler)
    container.addEventListener('touchstart', showControlsHandler)

    return () => {
      container.removeEventListener('mousemove', showControlsHandler)
      container.removeEventListener('touchstart', showControlsHandler)
      clearTimeout(timeout)
    }
  }, [isPlaying])

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const video = videoRef.current
      if (!video) return

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault()
          togglePlay()
          break
        case 'f':
          e.preventDefault()
          toggleFullscreen()
          break
        case 'm':
          e.preventDefault()
          toggleMute()
          break
        case 'ArrowLeft':
          e.preventDefault()
          video.currentTime = Math.max(0, video.currentTime - 10)
          break
        case 'ArrowRight':
          e.preventDefault()
          video.currentTime = Math.min(duration, video.currentTime + 10)
          break
        case 'ArrowUp':
          e.preventDefault()
          video.volume = Math.min(1, video.volume + 0.1)
          break
        case 'ArrowDown':
          e.preventDefault()
          video.volume = Math.max(0, video.volume - 0.1)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [duration])

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
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return
    const newVolume = parseFloat(e.target.value)
    video.volume = newVolume
    video.muted = newVolume === 0
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

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current
    const progress = progressRef.current
    if (!video || !progress) return

    const rect = progress.getBoundingClientRect()
    const pos = (e.clientX - rect.left) / rect.width
    video.currentTime = pos * duration
  }

  const changeQuality = (stream: VideoStream) => {
    const video = videoRef.current
    if (!video) return

    const currentTime = video.currentTime
    const wasPlaying = !video.paused

    setSelectedQuality(stream.quality)
    setShowQualityMenu(false)

    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }

    loadSource(stream)

    // Restore position after loading
    const handleLoaded = () => {
      video.currentTime = currentTime
      if (wasPlaying) video.play()
      video.removeEventListener('loadedmetadata', handleLoaded)
    }
    video.addEventListener('loadedmetadata', handleLoaded)
  }

  const retryPlayback = () => {
    setError(null)
    setUseEmbed(false)
    if (sortedStreams.length > 0) {
      loadSource(sortedStreams[0])
    }
  }

  const formatTime = (time: number): string => {
    if (!isFinite(time)) return '0:00'
    const hours = Math.floor(time / 3600)
    const mins = Math.floor((time % 3600) / 60)
    const secs = Math.floor(time % 60)
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Render embed iframe if using embed fallback
  if (useEmbed && embedUrl) {
    return (
      <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
        <iframe
          src={embedUrl}
          title={title || 'Video'}
          className="absolute inset-0 w-full h-full"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
        />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="relative aspect-video bg-gray-900 rounded-xl flex items-center justify-center">
        <div className="text-center p-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-white text-lg mb-4">{error}</p>
          <button
            onClick={retryPlayback}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg text-white font-medium hover:opacity-90"
          >
            <RotateCcw className="w-5 h-5" />
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-video bg-black rounded-xl overflow-hidden group"
      tabIndex={0}
    >
      <video
        ref={videoRef}
        poster={thumbnail}
        className="w-full h-full object-contain cursor-pointer"
        playsInline
        preload="metadata"
        onClick={togglePlay}
      />

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 pointer-events-none">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
        </div>
      )}

      {/* Big Play Button (when paused) */}
      {!isPlaying && !isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={togglePlay}
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
            <Play className="w-10 h-10 text-white fill-white ml-1" />
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      <div
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 py-3 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Bar */}
        <div
          ref={progressRef}
          className="relative h-1.5 bg-white/20 rounded-full cursor-pointer group/progress mb-3"
          onClick={handleProgressClick}
        >
          {/* Buffered */}
          <div
            className="absolute h-full bg-white/30 rounded-full"
            style={{ width: `${(buffered / duration) * 100}%` }}
          />
          {/* Progress */}
          <div
            className="absolute h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
          {/* Thumb */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-md opacity-0 group-hover/progress:opacity-100 transition-opacity"
            style={{ left: `calc(${(currentTime / duration) * 100}% - 8px)` }}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="text-white hover:text-purple-400 transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
            </button>

            {/* Volume */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <button
                onClick={toggleMute}
                className="text-white hover:text-purple-400 transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              </button>
              {showVolumeSlider && (
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="ml-2 w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer"
                />
              )}
            </div>

            {/* Time */}
            <span className="text-white text-sm tabular-nums">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quality Selector */}
            {sortedStreams.length > 1 && (
              <div className="relative">
                <button
                  onClick={() => setShowQualityMenu(!showQualityMenu)}
                  className="flex items-center gap-1 text-white hover:text-purple-400 transition-colors text-sm"
                  aria-label="Select quality"
                >
                  <Settings className="w-5 h-5" />
                  <span className="hidden sm:inline">{selectedQuality}</span>
                </button>
                {showQualityMenu && (
                  <div className="absolute bottom-full right-0 mb-2 bg-gray-900/95 backdrop-blur rounded-lg py-1 min-w-[100px] shadow-xl border border-white/10">
                    {sortedStreams.map((stream) => (
                      <button
                        key={stream.quality}
                        onClick={() => changeQuality(stream)}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-white/10 transition-colors ${stream.quality === selectedQuality ? 'text-purple-400 font-medium' : 'text-white'
                          }`}
                      >
                        {stream.quality}
                        {stream.quality === selectedQuality && ' ✓'}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-purple-400 transition-colors"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
