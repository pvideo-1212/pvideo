"use client"

import { useEffect, useState } from "react"
import { BarChart3, Users, Video, Eye, Activity, Globe } from "lucide-react"
import { getDashboardStats } from "@/app/actions/analytics"

export default function DashboardOverview() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
    // Refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadDashboardData = async () => {
    try {
      const stats = await getDashboardStats()
      if (stats) setData(stats)
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading && !data) {
    return <div className="p-8 text-center text-gray-500">Loading analytics...</div>
  }

  const statsConfig = [
    {
      label: "Real-time Visitors",
      value: data?.visitors?.realtime || 0,
      icon: Activity,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      desc: "Active in last 5 mins"
    },
    {
      label: "Daily Unique",
      value: data?.visitors?.daily || 0,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      desc: "Unique IPs today"
    },
    {
      label: "Total Content",
      value: data?.content?.videos || 0,
      icon: Video,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      desc: "Videos indexed"
    },
    {
      label: "Total Visitors",
      value: data?.visitors?.total || 0,
      icon: Globe,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      desc: "All time unique"
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Live Analytics</h2>
        <span className="text-xs text-gray-500 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Live updating
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsConfig.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">{stat.label}</h3>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
            </div>
          )
        })}
      </div>

      {/* Database Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Content Database</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-secondary/20 rounded-lg">
              <span className="text-gray-400">Videos</span>
              <span className="font-mono font-bold text-white">{data?.content?.videos || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-secondary/20 rounded-lg">
              <span className="text-gray-400">Categories</span>
              <span className="font-mono font-bold text-white">{data?.content?.categories || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-secondary/20 rounded-lg">
              <span className="text-gray-400">Channels</span>
              <span className="font-mono font-bold text-white">{data?.content?.channels || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-secondary/20 rounded-lg">
              <span className="text-gray-400">Models</span>
              <span className="font-mono font-bold text-white">{data?.content?.pornstars || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Recent Visitors (Live)</h3>
          <div className="space-y-2 max-h-[240px] overflow-y-auto">
            {data?.visitors?.recent?.map((user: any, i: number) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0 text-sm">
                <div className="font-mono text-gray-300">{user.ip}</div>
                <div className="text-xs text-gray-500">
                  {Math.floor((Date.now() - user.lastSeen) / 1000)}s ago
                </div>
              </div>
            ))}
            {(!data?.visitors?.recent || data.visitors.recent.length === 0) && (
              <div className="text-center text-gray-500 py-8">No active visitors</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
