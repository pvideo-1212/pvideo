"use client"

import { useState, useEffect, Suspense } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import CustomVideoPlayer from "@/components/custom-video-player"
import { ThumbsUp, Share2, Eye, Calendar, Loader2, ArrowLeft, Home, Play } from "lucide-react"

const staticVideos: Record<string, any> = {
  "1": {
    id: "1",
    title: "Premium Entertainment",
    views: 125000,
    date: "2024-12-01",
    description: "Premium content available on StreamHub",
    directVideoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    likes: 5000,
    tags: ["Premium", "HD", "Entertainment"],
  }
}

const defaultVideo = {
  id: "0",
  title: "Welcome to StreamHub",
  views: 5000,
  date: "2024-10-01",
  description: "Welcome to StreamHub - your premium destination for entertainment.",
  directVideoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  likes: 500,
  tags: ["Welcome", "Getting Started"],
}

function VideoContent() {
  const params = useParams()
  const id = params.id as string
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(0)

  const video = staticVideos[id] || defaultVideo

  useEffect(() => {
    setLikes(video.likes)
  }, [video.likes])

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      <header className="sticky top-0 z-50 bg-[#1b1b1b] border-b border-[#2c2c2c]">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" /><span className="hidden sm:inline">Back</span>
            </Link>
            <div className="h-6 w-px bg-[#2c2c2c]" />
            <Link href="/" className="flex items-center">
              <span className="text-lg font-extrabold text-white tracking-tight">Porn</span>
              <span className="text-lg font-extrabold bg-[#FF9000] text-black px-1.5 py-0.5 rounded ml-0.5 tracking-tight">hub</span>
            </Link>
          </div>
          <Link href="/" className="px-4 py-2 bg-[#2c2c2c] text-white rounded-lg text-sm flex items-center gap-2">
            <Home className="w-4 h-4" />Browse
          </Link>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-black rounded-xl overflow-hidden aspect-video">
              <CustomVideoPlayer src={video.directVideoUrl} title={video.title} />
            </div>
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-white">{video.title}</h1>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{video.views?.toLocaleString()} views</span>
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{video.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => { setIsLiked(!isLiked); setLikes(l => isLiked ? l - 1 : l + 1) }}
                    className={`px-4 py-2 rounded-full flex items-center gap-2 ${isLiked ? 'bg-[#FF9000] text-black' : 'bg-[#2c2c2c] text-white'}`}>
                    <ThumbsUp className="w-4 h-4" />{likes}
                  </button>
                  <button className="px-4 py-2 rounded-full bg-[#2c2c2c] text-white flex items-center gap-2">
                    <Share2 className="w-4 h-4" />Share
                  </button>
                </div>
              </div>
              <div className="p-4 bg-[#1b1b1b] rounded-lg border border-[#2c2c2c]">
                <p className="text-sm text-gray-300">{video.description}</p>
              </div>
              {video.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {video.tags.map((tag: string) => (
                    <span key={tag} className="px-3 py-1 bg-[#FF9000]/20 text-[#FF9000] rounded-full text-sm">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Related Videos</h3>
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <Link key={i} href="/" className="flex gap-3 group">
                  <div className="w-32 h-20 rounded-lg bg-[#2c2c2c] flex items-center justify-center">
                    <Play className="w-6 h-6 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm text-white font-medium group-hover:text-[#FF9000] line-clamp-2">Related Video {i}</h4>
                    <span className="text-xs text-gray-500 mt-1 block">{Math.floor(Math.random() * 100000)} views</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-[#2c2c2c] mt-12 py-6 text-center text-sm text-gray-500">
        © 2025 Pornhub. 18+ Only.
      </footer>
    </div>
  )
}

export default function VideoDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#FF9000]" /></div>}>
      <VideoContent />
    </Suspense>
  )
}
