import { NextRequest } from 'next/server'

// CORS proxies for fallback
const CORS_PROXIES = [
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
]

// Fetch with CORS proxy fallback
async function fetchWithFallback(url: string, headers: Record<string, string>): Promise<Response | null> {
  // Try direct fetch first
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    const response = await fetch(url, {
      headers,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    if (response.ok) {
      return response
    }
  } catch (e) {
    console.log('[HLS Proxy] Direct fetch failed, trying proxies...')
  }

  // Try CORS proxies
  for (let i = 0; i < CORS_PROXIES.length; i++) {
    const proxyUrl = CORS_PROXIES[i](url)
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000)

      const response = await fetch(proxyUrl, {
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      if (response.ok) {
        console.log(`[HLS Proxy] Proxy ${i + 1} succeeded`)
        return response
      }
    } catch (e) {
      console.log(`[HLS Proxy] Proxy ${i + 1} failed`)
    }
  }

  return null
}

// This proxies HLS m3u8 playlists and video segments
// Rewrites URLs to go through our server, bypassing regional blocks
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const targetUrl = searchParams.get('url')

  if (!targetUrl) {
    return new Response('URL parameter required', { status: 400 })
  }

  console.log('[HLS Proxy] Fetching:', targetUrl.slice(0, 80) + '...')

  try {
    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://www.eporner.com/',
      'Origin': 'https://www.eporner.com',
    }

    const response = await fetchWithFallback(targetUrl, headers)

    if (!response) {
      console.error('[HLS Proxy] All fetch attempts failed')
      return new Response('Failed to fetch video', { status: 502 })
    }

    const contentType = response.headers.get('content-type') || ''

    // If it's an m3u8 playlist, rewrite URLs to go through our proxy
    if (targetUrl.includes('.m3u8') || contentType.includes('mpegurl') || contentType.includes('m3u8')) {
      let content = await response.text()

      // Get the base URL for relative paths
      const baseUrl = targetUrl.substring(0, targetUrl.lastIndexOf('/') + 1)

      // Rewrite segment URLs to go through our proxy
      content = content.split('\n').map(line => {
        const trimmed = line.trim()

        // Skip comments and empty lines
        if (trimmed.startsWith('#') || trimmed === '') {
          // But handle #EXT-X-KEY and similar with URIs
          if (trimmed.includes('URI="')) {
            return trimmed.replace(/URI="([^"]+)"/g, (match, uri) => {
              const fullUrl = uri.startsWith('http') ? uri : baseUrl + uri
              return `URI="/api/proxy/hls?url=${encodeURIComponent(fullUrl)}"`
            })
          }
          return line
        }

        // Handle segment URLs
        let fullUrl = trimmed
        if (!trimmed.startsWith('http')) {
          fullUrl = baseUrl + trimmed
        }

        // Return proxied URL
        return `/api/proxy/hls?url=${encodeURIComponent(fullUrl)}`
      }).join('\n')

      return new Response(content, {
        headers: {
          'Content-Type': 'application/vnd.apple.mpegurl',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache',
        },
      })
    }

    // For video segments (.ts, .mp4), stream directly
    const responseHeaders = new Headers()
    responseHeaders.set('Content-Type', contentType || 'video/mp2t')
    responseHeaders.set('Access-Control-Allow-Origin', '*')
    responseHeaders.set('Cache-Control', 'public, max-age=3600')
    responseHeaders.set('Accept-Ranges', 'bytes')

    if (response.headers.get('content-length')) {
      responseHeaders.set('Content-Length', response.headers.get('content-length')!)
    }

    return new Response(response.body, { headers: responseHeaders })

  } catch (error) {
    console.error('[HLS Proxy] Error:', error)
    return new Response('Proxy error', { status: 500 })
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  })
}
