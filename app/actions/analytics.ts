'use server'

// No Redis - return empty stats

export async function getAnalytics() {
  return {
    realtime: 0,
    daily: 0,
    total: 0,
    recentUsers: []
  }
}

export async function getRedisStats() {
  return {
    videos: 0,
    pornstars: 0,
    channels: 0,
    categories: 0
  }
}

export async function getDashboardStats() {
  return {
    totalVideos: 0,
    totalCategories: 0,
    totalChannels: 0,
    totalPornstars: 0,
    activeNow: 0,
    todayViews: 0,
    totalViews: 0,
    recentActivity: []
  }
}

export async function getAnalyticsStats() {
  return {
    activeNow: 0,
    todayTotal: 0,
    uniqueIPs: 0,
    pageViews: 0,
  }
}
