import { NextRequest } from 'next/server'

// This proxies HLS m3u8 playlists and video segments through your USA server
// Bypasses regional blocks for Indian users since requests come from USA
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const targetUrl = searchParams.get('url')

  if (!targetUrl) {
    return new Response('URL parameter required', { status: 400 })
  }

  // Decode the URL if it was double-encoded
  const decodedUrl = decodeURIComponent(targetUrl)
  console.log('[HLS Proxy] Fetching:', decodedUrl.slice(0, 100) + '...')

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000) // 60s for large segments

    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'identity', // Don't compress for streaming
        'Referer': 'https://www.eporner.com/',
        'Origin': 'https://www.eporner.com',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.error('[HLS Proxy] Upstream error:', response.status, response.statusText)
      return new Response(`Upstream error: ${response.status}`, { status: response.status })
    }

    const contentType = response.headers.get('content-type') || ''

    // Handle m3u8 playlists - rewrite URLs to go through our proxy
    if (decodedUrl.includes('.m3u8') || contentType.includes('mpegurl') || contentType.includes('m3u8')) {
      let content = await response.text()

      // Get the base URL for relative paths
      const baseUrl = decodedUrl.substring(0, decodedUrl.lastIndexOf('/') + 1)

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
    responseHeaders.set('Content-Type', contentType || 'video/mp2t')
    responseHeaders.set('Access-Control-Allow-Origin', '*')
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
    responseHeaders.set('Cache-Control', 'public, max-age=31536000') // Cache segments for 1 year
    responseHeaders.set('Accept-Ranges', 'bytes')

    // Preserve content length for proper streaming
    const contentLength = response.headers.get('content-length')
    if (contentLength) {
      responseHeaders.set('Content-Length', contentLength)
    }

    // Stream the response body
    return new Response(response.body, {
      headers: responseHeaders,
      status: response.status,
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('[HLS Proxy] Error:', errorMessage)

    if (errorMessage.includes('aborted')) {
      return new Response('Request timeout', { status: 504 })
    }

    return new Response('Proxy error: ' + errorMessage, { status: 500 })
  }
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
