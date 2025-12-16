
"use client"

import { useEffect, useState } from "react"
import { Users, UserPlus, Eye, Clock, Loader2, RefreshCcw } from "lucide-react"

interface AnalyticsStats {
  realtime: number
  utils: { ip: string, lastSeen: number }[]
  daily: number
  total: number
}

export default function AnalyticsView() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/analytics/stats")
      const data = await res.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    // Auto refresh every 10 seconds
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [])

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Analytics Overview</h2>
        <button onClick={() => { setLoading(true); fetchStats() }}
          className="p-2 hover:bg-white/5 rounded-full transition-colors">
          <RefreshCcw className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-500/10 text-green-500">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Real-time Users</p>
              <h3 className="text-2xl font-bold">{stats.realtime}</h3>
              <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Active now
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-500/10 text-blue-500">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Unique Visitors (Today)</p>
              <h3 className="text-2xl font-bold">{stats.daily}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Since midnight
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-purple-500/10 text-purple-500">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Unique Visitors</p>
              <h3 className="text-2xl font-bold">{stats.total}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                All time
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Visitors Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30">
          <h3 className="font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" /> Recent Active Users
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
              <tr>
                <th className="px-6 py-3 font-medium">IP Address</th>
                <th className="px-6 py-3 font-medium">Last Seen</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {stats.utils.length > 0 ? (
                stats.utils.map((visitor, i) => (
                  <tr key={`${visitor.ip}-${i}`} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-3 font-medium">{visitor.ip}</td>
                    <td className="px-6 py-3 text-muted-foreground">
                      {new Date(visitor.lastSeen).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Online
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">
                    No active users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
