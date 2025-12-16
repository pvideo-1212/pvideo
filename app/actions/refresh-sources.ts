"use server"

import * as fs from "fs"
import * as path from "path"

const DATA_FILE = path.join(process.cwd(), "data.json")
const SOURCE_CACHE_HOURS = 4 // Re-scrape if sources are older than 4 hours

interface VideoSource {
  src: string
  quality: string
  type: string | null
}

interface VideoData {
  title: string
  videoUrl: string
  image?: string
  duration?: string
  models?: string[]
  views?: string
  videoSources: VideoSource[]
  categories?: string[]
  scrapedAt?: string
}

interface DataStore {
  videos: VideoData[]
  lastUpdated: string
  totalVideos: number
}

// Load data from file
function loadData(): DataStore {
  try {
    const rawData = fs.readFileSync(DATA_FILE, "utf-8")
    return JSON.parse(rawData)
  } catch (error) {
    console.error("[RefreshSources] Could not load data.json:", error)
    return { videos: [], lastUpdated: "", totalVideos: 0 }
  }
}

// Save data to file
function saveData(data: DataStore): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8")
  console.log("[RefreshSources] Data saved to data.json")
}

// Check if sources need refresh (older than 4 hours)
function needsRefresh(scrapedAt: string | undefined): boolean {
  if (!scrapedAt) return true

  const scrapedTime = new Date(scrapedAt).getTime()
  const now = Date.now()
  const hoursDiff = (now - scrapedTime) / (1000 * 60 * 60)

  return hoursDiff > SOURCE_CACHE_HOURS
}

// Scrape video sources using Puppeteer (dynamic import to avoid module load issues)
async function scrapeVideoSources(videoUrl: string): Promise<VideoSource[]> {
  console.log("[RefreshSources] Launching Puppeteer for:", videoUrl)

  // Dynamic import to avoid issues with Next.js server actions
  const puppeteer = await import("puppeteer")

  const browser = await puppeteer.default.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled"
    ],
  })

  try {
    const page = await browser.newPage()

    // Set user agent to avoid detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    await page.setViewport({ width: 1920, height: 1080 })

    console.log("[RefreshSources] Navigating to video page...")
    await page.goto(videoUrl, { waitUntil: "networkidle2", timeout: 30000 })

    const videoSources = await page.evaluate(() => {
      const sources: { src: string; quality: string; type: string | null }[] = []
      const seenUrls = new Set<string>()

      // Get video element sources
      const videoEl = document.querySelector("video")
      if (videoEl) {
        const videoSrc = videoEl.getAttribute("src")
        if (videoSrc && !seenUrls.has(videoSrc)) {
          seenUrls.add(videoSrc)
          const qualityMatch = videoSrc.match(/_(\d+)m\.mp4/)
          sources.push({
            src: videoSrc,
            quality: qualityMatch ? qualityMatch[1] + "p" : "default",
            type: "video/mp4"
          })
        }

        // Get source elements
        const sourceEls = videoEl.querySelectorAll("source")
        sourceEls.forEach((source) => {
          const src = source.getAttribute("src")
          if (src && !seenUrls.has(src)) {
            seenUrls.add(src)
            const qualityMatch = src.match(/_(\d+)m\.mp4/)
            sources.push({
              src,
              quality: qualityMatch ? qualityMatch[1] + "p" : "default",
              type: source.getAttribute("type") || "video/mp4"
            })
          }
        })
      }

      // Also look for get_file URLs in page content
      const pageHtml = document.documentElement.innerHTML
      const getFilePattern = /https?:\/\/[^\s"'<>]*\/get_file\/[^\s"'<>]*\.mp4[^\s"'<>]*/gi
      const matches = pageHtml.match(getFilePattern) || []

      matches.forEach((url) => {
        const cleanUrl = url.replace(/\\/g, '').replace(/&amp;/g, '&')
        if (!seenUrls.has(cleanUrl)) {
          seenUrls.add(cleanUrl)
          const qualityMatch = cleanUrl.match(/_(\d+)m\.mp4/)
          sources.push({
            src: cleanUrl,
            quality: qualityMatch ? qualityMatch[1] + "p" : "unknown",
            type: "video/mp4"
          })
        }
      })

      return sources
    })

    console.log("[RefreshSources] Found", videoSources.length, "sources")
    return videoSources
  } catch (error) {
    console.error("[RefreshSources] Scraping failed:", error)
    return []
  } finally {
    await browser.close()
  }
}

// Server action: Refresh video sources for a specific video
export async function refreshVideoSources(videoId: string): Promise<{
  success: boolean
  sources: VideoSource[]
  error?: string
}> {
  console.log("[RefreshSources] Refreshing sources for:", videoId)

  try {
    const dataStore = loadData()

    // Find the video by ID (slug)
    const videoIndex = dataStore.videos.findIndex(v => {
      const slug = v.videoUrl
        ?.replace('https://www.wow.xxx/videos/', '')
        ?.replace(/\/$/, '')
      return slug === videoId
    })

    if (videoIndex === -1) {
      return { success: false, sources: [], error: "Video not found" }
    }

    const video = dataStore.videos[videoIndex]

    // Check if we need to refresh
    if (!needsRefresh(video.scrapedAt) && video.videoSources?.length > 0) {
      console.log("[RefreshSources] Sources still fresh, using cache")
      return { success: true, sources: video.videoSources }
    }

    // Scrape fresh sources
    if (!video.videoUrl) {
      return { success: false, sources: [], error: "Video URL missing" }
    }

    const freshSources = await scrapeVideoSources(video.videoUrl)

    if (freshSources.length === 0) {
      return { success: false, sources: [], error: "Could not scrape video sources" }
    }

    // Update the video in dataStore
    dataStore.videos[videoIndex].videoSources = freshSources
    dataStore.videos[videoIndex].scrapedAt = new Date().toISOString()
    dataStore.lastUpdated = new Date().toISOString()

    // Save to file
    saveData(dataStore)

    return { success: true, sources: freshSources }
  } catch (error: any) {
    console.error("[RefreshSources] Error:", error)
    return { success: false, sources: [], error: error.message }
  }
}

// Server action: Check if sources need refresh
export async function checkSourcesFresh(videoId: string): Promise<{
  needsRefresh: boolean
  scrapedAt?: string
}> {
  const dataStore = loadData()

  const video = dataStore.videos.find(v => {
    const slug = v.videoUrl
      ?.replace('https://www.wow.xxx/videos/', '')
      ?.replace(/\/$/, '')
    return slug === videoId
  })

  if (!video) {
    return { needsRefresh: true }
  }

  return {
    needsRefresh: needsRefresh(video.scrapedAt),
    scrapedAt: video.scrapedAt
  }
}
