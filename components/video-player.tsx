"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, Maximize } from "lucide-react"

interface VideoPlayerProps {
  videoUrl: string
  title: string
  onProgress?: (progress: number, duration: number) => void
  resumeTime?: number
}

export default function VideoPlayer({ videoUrl, title, onProgress, resumeTime = 0 }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (resumeTime > 0 && iframeRef.current) {
      // Resume from saved position
      const message = {
        method: "setCurrentTime",
        value: resumeTime,
      }
      iframeRef.current.contentWindow?.postMessage(message, "*")
    }
  }, [resumeTime])

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.event === "infoDelivery" && event.data.info?.currentTime) {
        const progress = (event.data.info.currentTime / event.data.info.duration) * 100
        if (onProgress) {
          onProgress(Math.round(progress), Math.round(event.data.info.currentTime))
        }
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [onProgress])

  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden group">
      {/* Video Container */}
      <div className="relative aspect-video bg-black">
        <iframe
          ref={iframeRef}
          width="100%"
          height="100%"
          src={`${videoUrl}?autoplay=0`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>

      {/* Player Controls Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 hover:bg-white/20 rounded transition">
              {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
            </button>
            <button className="p-2 hover:bg-white/20 rounded transition">
              <Volume2 className="w-5 h-5 text-white" />
            </button>
          </div>
          <button className="p-2 hover:bg-white/20 rounded transition">
            <Maximize className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
