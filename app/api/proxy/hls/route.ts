import { NextRequest } from 'next/server'

// Extract video ID from URL for proper referer
function getVideoIdFromUrl(url: string): string | null {
  // Pattern: https://gvideo.eporner.com/5B3ASVhCAPy/5B3ASVhCAPy.mp4
  const match = url.match(/eporner\.com\/([a-zA-Z0-9]+)\//)
  return match ? match[1] : null
}

// This proxies HLS m3u8 playlists and video segments through your USA server
// Bypasses regional blocks for Indian users since requests come from USA
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const targetUrl = searchParams.get('url')

  if (!targetUrl) {
    return new Response('URL parameter required', { status: 400 })
  }

  // Decode the URL if it was double-encoded
  let decodedUrl = targetUrl
  try {
    decodedUrl = decodeURIComponent(targetUrl)
  } catch {
    // URL might not be encoded
  }

  console.log('[HLS Proxy] Fetching:', decodedUrl.slice(0, 100) + '...')

  // Get video ID for proper referer
  const videoId = getVideoIdFromUrl(decodedUrl)
  const refererUrl = videoId
    ? `https://www.eporner.com/video-${videoId}/`
    : 'https://www.eporner.com/'
  const embedUrl = videoId
    ? `https://www.eporner.com/embed/${videoId}/`
    : 'https://www.eporner.com/'

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 90000) // 90s for large video files

    // Use headers that make it look like the request is from the embed player
    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'identity', // Don't compress for streaming
        'Referer': embedUrl,  // Critical: Must be the embed page
        'Origin': 'https://www.eporner.com',
        'Sec-Fetch-Dest': 'video',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'Range': request.headers.get('range') || 'bytes=0-', // Support range requests
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok && response.status !== 206) {
      console.error('[HLS Proxy] Upstream error:', response.status, response.statusText)

      // If 403, try with different referer
      if (response.status === 403) {
        console.log('[HLS Proxy] Retrying with video page referer...')
        const retryResponse = await fetch(decodedUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': refererUrl,
            'Origin': 'https://www.eporner.com',
            'Range': request.headers.get('range') || 'bytes=0-',
          },
        })

        if (retryResponse.ok || retryResponse.status === 206) {
          return streamResponse(retryResponse, decodedUrl)
        }
      }

      return new Response(`Upstream error: ${response.status}`, { status: response.status })
    }

    return streamResponse(response, decodedUrl)

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('[HLS Proxy] Error:', errorMessage)

    if (errorMessage.includes('aborted')) {
      return new Response('Request timeout', { status: 504 })
    }

    return new Response('Proxy error: ' + errorMessage, { status: 500 })
  }
}

// Helper to stream the response with proper headers
async function streamResponse(response: Response, originalUrl: string): Promise<Response> {
  const contentType = response.headers.get('content-type') || ''

  // Handle m3u8 playlists - rewrite URLs to go through our proxy
  if (originalUrl.includes('.m3u8') || contentType.includes('mpegurl') || contentType.includes('m3u8')) {
    let content = await response.text()

    // Get the base URL for relative paths
    const baseUrl = originalUrl.substring(0, originalUrl.lastIndexOf('/') + 1)

    // Rewrite segment URLs to go through our proxy
    content = content.split('\n').map(line => {
      const trimmed = line.trim()

      // Skip empty lines
      if (trimmed === '') return line

      // Handle comment lines with URIs (e.g., #EXT-X-KEY)
      if (trimmed.startsWith('#')) {
        if (trimmed.includes('URI="')) {
          return trimmed.replace(/URI="([^"]+)"/g, (_, uri) => {
            const fullUrl = uri.startsWith('http') ? uri : baseUrl + uri
            return `URI="/api/proxy/hls?url=${encodeURIComponent(fullUrl)}"`
          })
        }
        return line
      }

      // Handle segment URLs (not comments)
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
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  }

  // For video segments (.ts, .mp4, etc.), stream the response
  const responseHeaders = new Headers()
  responseHeaders.set('Content-Type', contentType || 'video/mp4')
  responseHeaders.set('Access-Control-Allow-Origin', '*')
  responseHeaders.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
  responseHeaders.set('Access-Control-Expose-Headers', 'Content-Length, Content-Range')
  responseHeaders.set('Accept-Ranges', 'bytes')

  // Preserve range response headers for video seeking
  const contentLength = response.headers.get('content-length')
  const contentRange = response.headers.get('content-range')

  if (contentLength) {
    responseHeaders.set('Content-Length', contentLength)
  }
  if (contentRange) {
    responseHeaders.set('Content-Range', contentRange)
  }

  // Cache video segments for better performance
  responseHeaders.set('Cache-Control', 'public, max-age=86400') // 24 hours

  // Stream the response body
  return new Response(response.body, {
    headers: responseHeaders,
    status: response.status, // Preserve 206 for partial content
  })
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Max-Age': '86400',
    },
  })
}
