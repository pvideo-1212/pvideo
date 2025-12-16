'use server'

// In-memory analytics store (persists during server runtime)
// For production, use Redis or a database

interface Visitor {
  ip: string
  lastSeen: number
  firstSeen: number
  pageViews: number
}

interface AnalyticsStore {
  visitors: Map<string, Visitor>
  dailyVisitors: Set<string>
  dailyDate: string
  totalUniqueIPs: Set<string>
  pageViews: number
}

// Global store - persists between requests
const store: AnalyticsStore = {
  visitors: new Map(),
  dailyVisitors: new Set(),
  dailyDate: new Date().toDateString(),
  totalUniqueIPs: new Set(),
  pageViews: 0
}

// Clean stale visitors (over 5 minutes inactive)
function cleanStaleVisitors() {
  const now = Date.now()
  const staleThreshold = 5 * 60 * 1000 // 5 minutes

  for (const [ip, visitor] of store.visitors) {
    if (now - visitor.lastSeen > staleThreshold) {
      store.visitors.delete(ip)
    }
  }
}

// Reset daily stats at midnight
function checkDailyReset() {
  const today = new Date().toDateString()
  if (store.dailyDate !== today) {
    store.dailyVisitors.clear()
    store.dailyDate = today
  }
}

// Track a visitor
export async function trackVisitor(ip: string) {
  checkDailyReset()
  cleanStaleVisitors()

  const now = Date.now()
  const existing = store.visitors.get(ip)

  if (existing) {
    existing.lastSeen = now
    existing.pageViews++
  } else {
    store.visitors.set(ip, {
      ip,
      lastSeen: now,
      firstSeen: now,
      pageViews: 1
    })
  }

  store.dailyVisitors.add(ip)
  store.totalUniqueIPs.add(ip)
  store.pageViews++

  return { success: true }
}

// Get analytics for dashboard
export async function getAnalytics() {
  checkDailyReset()
  cleanStaleVisitors()

  const recentUsers = Array.from(store.visitors.values())
    .sort((a, b) => b.lastSeen - a.lastSeen)
    .slice(0, 20)

  return {
    realtime: store.visitors.size,
    daily: store.dailyVisitors.size,
    total: store.totalUniqueIPs.size,
    recentUsers
  }
}

// Get stats for API endpoint
export async function getAnalyticsStats() {
  checkDailyReset()
  cleanStaleVisitors()

  return {
    realtime: store.visitors.size,
    utils: Array.from(store.visitors.values())
      .sort((a, b) => b.lastSeen - a.lastSeen)
      .slice(0, 20),
    daily: store.dailyVisitors.size,
    total: store.totalUniqueIPs.size,
    pageViews: store.pageViews
  }
}

// Get dashboard stats with content counts
export async function getDashboardStats() {
  checkDailyReset()
  cleanStaleVisitors()

  // Fetch content counts from eporner API
  let videoCount = 5000000 // Default fallback
  try {
    const res = await fetch('https://www.eporner.com/api/v2/video/search/?query=all&per_page=1&format=json', {
      signal: AbortSignal.timeout(3000),
      cache: 'no-store'
    })
    if (res.ok) {
      const data = await res.json()
      videoCount = data.total_count || 5000000
    }
  } catch {
    // Use fallback
  }

  const recentUsers = Array.from(store.visitors.values())
    .sort((a, b) => b.lastSeen - a.lastSeen)
    .slice(0, 10)

  return {
    visitors: {
      realtime: store.visitors.size,
      daily: store.dailyVisitors.size,
      total: store.totalUniqueIPs.size,
      recent: recentUsers
    },
    content: {
      videos: videoCount,
      categories: 150, // Static - categories are fixed
      channels: 500,   // Static estimate
      pornstars: 10000 // Static estimate
    },
    pageViews: store.pageViews
  }
}

// Get Redis stats (now uses in-memory store)
export async function getRedisStats() {
  return {
    videos: store.pageViews,
    pornstars: 0,
    channels: 0,
    categories: 0
  }
}
