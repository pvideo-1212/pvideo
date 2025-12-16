"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, Check, RotateCcw, RotateCw, Loader2, AlertCircle, ExternalLink, RefreshCw } from "lucide-react"
import { refreshVideoSources } from "@/app/actions/refresh-sources"

interface VideoSourceInput {
  src: string
  quality: string
  type: string | null
}

interface CustomVideoPlayerProps {
  videoSources?: VideoSourceInput[]
  poster?: string
  title?: string
  originalUrl?: string
  videoId?: string
}

export default function CustomVideoPlayer({ videoSources: inputSources, poster, title, originalUrl, videoId }: CustomVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Processed sources sorted by quality
  const [sources, setSources] = useState<VideoSourceInput[]>([])
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isReady, setIsReady] = useState(false)

  // Custom player states
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [isBuffering, setIsBuffering] = useState(false)
  const [buffered, setBuffered] = useState(0)
  const [showQualityMenu, setShowQualityMenu] = useState(false)
  const [centerOverlay, setCenterOverlay] = useState<{ icon: React.ReactNode; visible: boolean }>({ icon: null, visible: false })

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const bufferTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const refreshAttempts = useRef(0)
  const maxRefreshAttempts = 2

  // Process and sort sources
  const processSources = useCallback((rawSources: VideoSourceInput[]) => {
    const validSources = rawSources
      .filter(s => s.src && s.quality)
      .map(s => ({
        ...s,
        quality: s.quality.replace('p', '').replace('auto (', '').replace(')', '').replace('default', '480')
      }))
      .sort((a, b) => {
        const qA = parseInt(a.quality) || 0
        const qB = parseInt(b.quality) || 0
        return qB - qA
      })

    if (validSources.length > 0) {
      setSources(validSources)
      const preferredIndex = validSources.findIndex(s => s.quality === '720')
      setCurrentSourceIndex(preferredIndex >= 0 ? preferredIndex : 0)
      return true
    }
    return false
  }, [])

  // Auto-refresh sources using server action
  const autoRefreshSources = useCallback(async (): Promise<boolean> => {
    if (!videoId || isRefreshing || refreshAttempts.current >= maxRefreshAttempts) {
      return false
    }

    console.log('[Player] Auto-refreshing sources (attempt', refreshAttempts.current + 1, ')')
    setIsRefreshing(true)
    refreshAttempts.current++

    try {
      const result = await refreshVideoSources(videoId)

      if (result.success && result.sources.length > 0) {
        console.log('[Player] Got fresh sources:', result.sources.length)

        if (processSources(result.sources)) {
          setHasError(false)
          setIsRefreshing(false)
          return true
        }
      } else {
        console.log('[Player] Refresh failed:', result.error)
      }
    } catch (error) {
      console.error('[Player] Refresh error:', error)
    }

    setIsRefreshing(false)
    return false
  }, [videoId, isRefreshing, processSources])

  // Initial load - check if sources are valid or need refresh
  useEffect(() => {
    const initPlayer = async () => {
      if (inputSources && inputSources.length > 0) {
        if (processSources(inputSources)) {
          setIsReady(true)
          return
        }
      }

      // No valid sources - auto refresh
      if (videoId) {
        console.log('[Player] No valid sources, auto-refreshing...')
        const refreshed = await autoRefreshSources()
        if (refreshed) {
          setIsReady(true)
          return
        }
      }

      setHasError(true)
      setErrorMessage('Video sources not available')
    }

    initPlayer()
  }, [inputSources, videoId, processSources, autoRefreshSources])

  const showCenterOverlay = (icon: React.ReactNode) => {
    setCenterOverlay({ icon, visible: true })
    setTimeout(() => setCenterOverlay(prev => ({ ...prev, visible: false })), 500)
  }

  // Get current source
  const currentSource = sources[currentSourceIndex]
  const currentQuality = currentSource?.quality || '720'

  // Handle video error - auto-refresh without user interaction
  const handleVideoError = useCallback(async () => {
    console.log('[Player] Video error on source', currentSourceIndex + 1, 'of', sources.length)

    // Try next source first
    if (currentSourceIndex < sources.length - 1) {
      setCurrentSourceIndex(prev => prev + 1)
      return
    }

    // All sources failed - auto refresh
    if (refreshAttempts.current < maxRefreshAttempts && videoId) {
      console.log('[Player] All sources failed, auto-refreshing...')
      setIsRefreshing(true)

      const refreshed = await autoRefreshSources()
      if (refreshed) {
        setCurrentSourceIndex(0)
        return
      }
    }

    // Show error only after all refresh attempts exhausted
    setHasError(true)
    setErrorMessage('Video playback failed after refresh attempts.')
  }, [currentSourceIndex, sources.length, videoId, autoRefreshSources])

  // Load new source when index changes
  useEffect(() => {
    const video = videoRef.current
    if (!video || !currentSource || !isReady) return

    console.log('[Player] Loading source:', currentSource.quality + 'p', currentSource.src.substring(0, 60))
    video.src = currentSource.src
    video.load()
  }, [currentSource, isReady])

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current
    if (!video || !isReady) return

    const handlers = {
      timeupdate: () => setCurrentTime(video.currentTime),
      durationchange: () => setDuration(video.duration),
      play: () => setIsPlaying(true),
      pause: () => setIsPlaying(false),
      waiting: () => {
        if (bufferTimeoutRef.current) clearTimeout(bufferTimeoutRef.current)
        bufferTimeoutRef.current = setTimeout(() => setIsBuffering(true), 300)
      },
      playing: () => setIsBuffering(false),
      canplay: () => setIsBuffering(false),
      progress: () => {
        if (video.buffered.length > 0) setBuffered(video.buffered.end(video.buffered.length - 1))
      },
      error: handleVideoError
    }

    Object.entries(handlers).forEach(([event, handler]) => video.addEventListener(event, handler))
    return () => {
      if (bufferTimeoutRef.current) clearTimeout(bufferTimeoutRef.current)
      Object.entries(handlers).forEach(([event, handler]) => video.removeEventListener(event, handler))
    }
  }, [handleVideoError, isReady])

  // Player controls
  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play()
      showCenterOverlay(<Play className="w-12 h-12 fill-white text-white" />)
    } else {
      video.pause()
      showCenterOverlay(<Pause className="w-12 h-12 fill-white text-white" />)
    }
  }, [])

  const toggleMute = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setIsMuted(video.muted)
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  const skip = useCallback((seconds: number) => {
    if (videoRef.current) videoRef.current.currentTime += seconds
  }, [])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  // Change quality
  const changeQuality = (index: number) => {
    const video = videoRef.current
    if (!video) return

    const savedTime = video.currentTime
    const wasPlaying = !video.paused

    setCurrentSourceIndex(index)
    setShowQualityMenu(false)

    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = savedTime
        if (wasPlaying) videoRef.current.play()
      }
    }, 100)
  }

  // Manual retry (resets attempts)
  const handleManualRetry = async () => {
    refreshAttempts.current = 0
    setHasError(false)
    setIsRefreshing(true)

    const refreshed = await autoRefreshSources()
    if (!refreshed) {
      setHasError(true)
      setErrorMessage('Could not refresh video sources')
    }
  }

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement instanceof HTMLInputElement) return
      switch (e.key.toLowerCase()) {
        case ' ': case 'k': e.preventDefault(); togglePlay(); break
        case 'f': e.preventDefault(); toggleFullscreen(); break
        case 'm': e.preventDefault(); toggleMute(); break
        case 'arrowleft': case 'j': e.preventDefault(); skip(-10); break
        case 'arrowright': case 'l': e.preventDefault(); skip(10); break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [togglePlay, toggleFullscreen, toggleMute, skip])

  // REFRESHING STATE - automatic, no user interaction needed
  if (isRefreshing && !isReady) {
    return (
      <div className="relative w-full aspect-video bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-xl flex flex-col items-center justify-center border border-[#2a2a2a]">
        <RefreshCw className="w-12 h-12 text-[#FF9000] animate-spin mb-4" />
        <p className="text-white font-medium">Getting fresh video sources...</p>
        <p className="text-white/50 text-sm mt-2">This is automatic, please wait</p>
      </div>
    )
  }

  // ERROR STATE - only shown after all auto-refresh attempts fail
  if (hasError) {
    return (
      <div className="w-full aspect-video bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-xl flex items-center justify-center border border-[#2a2a2a]">
        <div className="text-center p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-[#FF9000] font-semibold mb-2">Video unavailable</p>
          <p className="text-white/60 text-sm mb-4">{errorMessage}</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={handleManualRetry}
              disabled={isRefreshing}
              className="px-5 py-2 bg-[#FF9000] hover:bg-[#FF9000]/90 text-black font-bold rounded-lg text-sm flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Try Again
            </button>
            {originalUrl && (
              <a
                href={originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg text-sm flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Watch on Site
              </a>
            )}
          </div>
        </div>
      </div>
    )
  }

  // LOADING STATE
  if (!isReady || sources.length === 0) {
    return (
      <div className="relative w-full aspect-video bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] rounded-xl flex flex-col items-center justify-center border border-[#2a2a2a]">
        <Loader2 className="w-12 h-12 text-[#FF9000] animate-spin mb-4" />
        <p className="text-white font-medium">Loading video...</p>
      </div>
    )
  }

  // VIDEO PLAYER
  return (
    <div
      ref={containerRef}
      className={`relative group bg-black rounded-xl overflow-hidden shadow-2xl border border-[#2a2a2a] outline-none ${isFullscreen ? 'fixed inset-0 z-50 rounded-none border-0' : 'w-full aspect-video'}`}
      tabIndex={0}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => { if (isPlaying) setShowControls(false) }}
      onMouseMove={() => {
        setShowControls(true)
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
        if (isPlaying) controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 2000)
      }}
    >
      {/* Refresh indicator overlay */}
      {isRefreshing && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-30">
          <div className="text-center">
            <RefreshCw className="w-10 h-10 text-[#FF9000] animate-spin mx-auto mb-2" />
            <p className="text-white text-sm">Refreshing sources...</p>
          </div>
        </div>
      )}

      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain bg-black cursor-pointer"
        poster={poster}
        playsInline
        preload="metadata"
        onClick={togglePlay}
      >
        {sources.map((source, index) => (
          <source key={index} src={source.src} type={source.type || 'video/mp4'} />
        ))}
      </video>

      {/* Center Overlay */}
      {centerOverlay.visible && (
        <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
          <div className="bg-black/60 p-4 rounded-full backdrop-blur-sm">{centerOverlay.icon}</div>
        </div>
      )}

      {/* Buffering */}
      {isBuffering && !isRefreshing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="w-10 h-10 border-3 border-white/50 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Play Overlay */}
      {!isPlaying && !centerOverlay.visible && !isRefreshing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-xl group-hover:scale-110 transition-all">
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          </div>
        </div>
      )}

      {/* Controls */}
      <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-20 pb-4 px-4 transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
        {/* Progress Bar */}
        <div className="relative group/progress h-1.5 hover:h-2.5 bg-white/20 rounded-full mb-4 cursor-pointer transition-all">
          <div className="absolute inset-0 bg-white/30 rounded-full" style={{ width: `${(buffered / duration) * 100}%` }} />
          <div className="absolute inset-y-0 left-0 bg-[#FF9000] rounded-full flex items-center justify-end" style={{ width: `${(currentTime / duration) * 100}%` }}>
            <div className="w-3.5 h-3.5 bg-white rounded-full shadow-lg scale-0 group-hover/progress:scale-100 transition-transform" />
          </div>
          <input type="range" min={0} max={duration || 100} value={currentTime} onChange={(e) => { if (videoRef.current) videoRef.current.currentTime = Number(e.target.value) }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="text-white hover:text-[#FF9000] transition-colors">
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
            </button>
            <button onClick={() => skip(-10)} className="text-white/80 hover:text-white"><RotateCcw className="w-5 h-5" /></button>
            <button onClick={() => skip(10)} className="text-white/80 hover:text-white"><RotateCw className="w-5 h-5" /></button>
            <button onClick={toggleMute} className="text-white hover:text-[#FF9000]">
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <div className="text-xs font-medium text-white/90">{formatTime(currentTime)} / {formatTime(duration)}</div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quality Selector */}
            {sources.length > 1 && (
              <div className="relative">
                <button onClick={() => setShowQualityMenu(!showQualityMenu)} className="flex items-center gap-1 px-2 py-1 rounded hover:bg-white/10 text-xs font-medium text-white">
                  <Settings className="w-4 h-4" />{currentQuality}p
                </button>
                {showQualityMenu && (
                  <div className="absolute bottom-full right-0 mb-2 w-32 bg-black/90 border border-[#2a2a2a] rounded-lg overflow-hidden shadow-xl z-50">
                    {sources.map((source, index) => (
                      <button
                        key={index}
                        onClick={() => changeQuality(index)}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-white/10 flex items-center justify-between ${index === currentSourceIndex ? 'text-[#FF9000]' : 'text-white'}`}
                      >
                        {source.quality}p
                        {index === currentSourceIndex && <Check className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <button onClick={toggleFullscreen} className="text-white hover:text-[#FF9000]">
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
