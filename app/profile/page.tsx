"use client"

import { useAuth } from "@/components/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { LogOut, Mail, User, Clock, TrendingUp, Award } from "lucide-react"
import { watchHistoryOperations, videoDb } from "@/lib/db"
import Link from "next/link"

interface WatchHistoryItem {
  id: string
  videoId: string
  videoTitle: string
  progress: number
  watchedAt: string
  thumbnail: string
}

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([])
  const [stats, setStats] = useState({ totalWatched: 0, totalHours: 0, videosCompleted: 0 })
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else {
      loadUserData()
    }
  }, [user, router])

  const loadUserData = async () => {
    if (!user) return

    const history = await watchHistoryOperations.getByUserId(user.id)
    const allVideos = await videoDb.getAll()

    const enrichedHistory: WatchHistoryItem[] = await Promise.all(
      history.map(async (h) => {
        const video = allVideos.find((v) => v.id === h.videoId)
        return {
          id: h.id,
          videoId: h.videoId,
          videoTitle: video?.title || "Unknown Video",
          progress: h.progress,
          watchedAt: h.watchedAt,
          thumbnail: video?.thumbnail || "/placeholder.svg?height=100&width=180",
        }
      }),
    )

    setWatchHistory(enrichedHistory)

    // Calculate stats
    const totalWatched = enrichedHistory.length
    const videosCompleted = enrichedHistory.filter((h) => h.progress >= 90).length
    const totalHours = Math.round((totalWatched * 45) / 60) // Assuming average 45 min videos

    setStats({
      totalWatched,
      totalHours,
      videosCompleted,
    })
  }

  if (!user) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const planBadgeColor = {
    free: "bg-muted text-muted-foreground",
    pro: "bg-primary/20 text-primary",
    enterprise: "bg-accent/20 text-accent",
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={() => { }} />

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Profile Header */}
        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-8 pb-8 border-b border-border">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{user.name}</h1>
                <p className="text-muted-foreground mb-3">{user.email}</p>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${planBadgeColor.pro}`}>Pro Plan</span>
              </div>
            </div>
            <Button onClick={handleLogout} variant="destructive" className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-background rounded-lg p-4 border border-border">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">Total Hours Watched</p>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.totalHours}h</p>
            </div>
            <div className="bg-background rounded-lg p-4 border border-border">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">Videos Watched</p>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.totalWatched}</p>
            </div>
            <div className="bg-background rounded-lg p-4 border border-border">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.videosCompleted}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-4 border-b border-border">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-3 font-medium transition ${activeTab === "overview"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-3 font-medium transition ${activeTab === "history"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Watch History
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-3 font-medium transition ${activeTab === "settings"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Settings
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Account Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Full Name</label>
                  <p className="text-lg text-foreground">{user.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Email Address</label>
                  <div className="flex items-center gap-2 text-lg text-foreground">
                    <Mail className="w-5 h-5 text-primary" />
                    {user.email}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">User ID</label>
                  <p className="text-sm font-mono text-muted-foreground">{user.id}</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Current Plan</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-foreground mb-1">Pro Plan</p>
                  <p className="text-sm text-muted-foreground">Unlimited access to all courses</p>
                </div>
                <Button variant="outline">Manage Plan</Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div>
            <h2 className="text-xl font-bold text-foreground mb-6">Watch History</h2>
            {watchHistory.length > 0 ? (
              <div className="space-y-4">
                {watchHistory.map((item) => (
                  <Link key={item.id} href={`/video/${item.videoId}`}>
                    <div className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition cursor-pointer">
                      <div className="flex gap-4">
                        <img
                          src={"https://cdn.occubitsolution.com/uploads/1762317294387-a9676d26734a87ae.png"}
                          // src={item.thumbnail || "/placeholder.svg"}
                          alt={item.videoTitle}
                          className="w-32 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-2">{item.videoTitle}</h3>
                          <div className="flex items-center justify-between">
                            <div className="w-full bg-muted rounded-full h-2 mr-4">
                              <div className="bg-primary h-2 rounded-full" style={{ width: `${item.progress}%` }} />
                            </div>
                            <span className="text-sm text-muted-foreground whitespace-nowrap">{item.progress}%</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Watched on {new Date(item.watchedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No watch history yet</p>
                <Link href="/">
                  <Button>Start Watching</Button>
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates about new courses</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <p className="font-medium text-foreground">Auto-play Next Video</p>
                    <p className="text-sm text-muted-foreground">Automatically play next video in series</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Danger Zone</h2>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
