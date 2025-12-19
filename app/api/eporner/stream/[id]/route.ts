import { NextRequest } from 'next/server'

type RouteContext = {
  params: Promise<{ id: string }>
}

// Fetch with proper browser headers (works from USA server)
async function fetchWithBrowserHeaders(url: string, timeout = 15000): Promise<Response | null> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const response = await fetch(url, {
      headers: {
        // Mimic real Chrome browser - reduces bot detection
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0',
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    return response.ok ? response : null
  } catch (error) {
    console.log('[Video Stream] Fetch error:', (error as Error).message)
    return null
  }
}

// Extract video sources from embed page HTML
function extractVideoSources(html: string): { hls: string[], mp4: string[] } {
  const hls: string[] = []
  const mp4: string[] = []

  // Clean up escaped characters that might be in JavaScript
  const cleanHtml = html
    .replace(/\\u002F/g, '/')
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, '\\')
    .replace(/\\'/g, "'")

  // Pattern 1: HLS m3u8 URLs (primary video format)
  const hlsRegex = /https?:\/\/[^\s"'<>\\]+\.m3u8[^\s"'<>\\]*/gi
  let match
  while ((match = hlsRegex.exec(cleanHtml)) !== null) {
    const url = match[0].replace(/["']/g, '').split('\\')[0]
    if (url.includes('.m3u8') && !hls.includes(url)) {
      hls.push(url)
    }
  }

  // Pattern 2: MP4 URLs (fallback format)
  const mp4Regex = /https?:\/\/[^\s"'<>\\]+\.mp4[^\s"'<>\\]*/gi
  while ((match = mp4Regex.exec(cleanHtml)) !== null) {
    const url = match[0].replace(/["']/g, '').split('\\')[0]
    // Exclude thumbnails and previews
    if (url.includes('.mp4') && !url.includes('thumb') && !url.includes('preview') && !url.includes('poster') && !mp4.includes(url)) {
      mp4.push(url)
    }
  }

  // Pattern 3: Look for source/src attributes with video URLs
  const srcRegex = /(?:src|source|file|url)\s*[=:]\s*["']([^"']+(?:\.m3u8|\.mp4)[^"']*)/gi
  while ((match = srcRegex.exec(cleanHtml)) !== null) {
    let url = match[1].replace(/\\u002F/g, '/').replace(/\\/g, '')
    if (!url.startsWith('http')) url = 'https:' + url

    if (url.includes('.m3u8') && !hls.includes(url)) {
      hls.push(url)
    } else if (url.includes('.mp4') && !url.includes('thumb') && !mp4.includes(url)) {
      mp4.push(url)
    }
  }

  // Pattern 4: eporner-specific patterns (EP.video, videoSrc, etc.)
  const epPatterns = [
    /EP\.video\s*=\s*\{[^}]*src\s*:\s*["']([^"']+)/i,
    /videoSrc\s*[=:]\s*["']([^"']+)/i,
    /video_url\s*[=:]\s*["']([^"']+)/i,
  ]

  for (const pattern of epPatterns) {
    const epMatch = cleanHtml.match(pattern)
    if (epMatch && epMatch[1]) {
      let url = epMatch[1].replace(/\\u002F/g, '/').replace(/\\/g, '')
      if (!url.startsWith('http')) url = 'https:' + url

      if (url.includes('.m3u8') && !hls.includes(url)) {
        hls.unshift(url) // Prioritize these sources
      } else if (url.includes('.mp4') && !mp4.includes(url)) {
        mp4.unshift(url)
      }
    }
  }

  console.log('[Video Stream] Raw extraction - HLS:', hls.length, 'MP4:', mp4.length)

  return {
    hls: [...new Set(hls)],
    mp4: [...new Set(mp4)],
  }
}

// Main API handler - works from USA server, falls back to embed for India dev
export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params

  if (!id) {
    return Response.json({ error: 'Video ID required' }, { status: 400 })
  }

  console.log('[Video Stream] Fetching sources for:', id)
  const embedUrl = `https://www.eporner.com/embed/${id}/`

  try {
    // Server-side fetch - bypasses CORS entirely
    // This works perfectly from USA VPS where there's no network blocking
    const response = await fetchWithBrowserHeaders(embedUrl)

    if (response) {
      const html = await response.text()
      console.log('[Video Stream] Fetched embed page, size:', html.length)

      if (html.length > 1000) {
        const sources = extractVideoSources(html)

        if (sources.hls.length > 0 || sources.mp4.length > 0) {
          console.log('[Video Stream] SUCCESS - HLS:', sources.hls.length, 'MP4:', sources.mp4.length)

          return Response.json({
            success: true,
            sources: {
              hls: sources.hls,
              mp4: sources.mp4,
            },
            videoId: id,
            method: 'server-proxy',
          }, {
            headers: {
              'Cache-Control': 'public, max-age=300', // Cache 5 minutes
            }
          })
        }
      }
    }

    // Fallback for local development (India) - use embed iframe
    console.log('[Video Stream] Falling back to embed (likely dev environment)')
    return Response.json({
      success: true,
      sources: {
        hls: [],
        mp4: [],
        embed: embedUrl,
      },
      videoId: id,
      method: 'embed-fallback',
    })

  } catch (error) {
    console.error('[Video Stream] Error:', error)

    // Always return embed as ultimate fallback
    return Response.json({
      success: true,
      sources: {
        hls: [],
        mp4: [],
        embed: embedUrl,
      },
      videoId: id,
      method: 'error-fallback',
    })
  }
}
