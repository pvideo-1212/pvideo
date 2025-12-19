import { NextRequest } from 'next/server'

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
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.eporner.com/',
        'Origin': 'https://www.eporner.com',
      },
      signal: AbortSignal.timeout(60000),
    })

    if (!response.ok) {
      console.error('[HLS Proxy] Upstream error:', response.status)
      return new Response(`Upstream error: ${response.status}`, { status: response.status })
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
              return `URI="${encodeURIComponent(fullUrl)}"`
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
    const headers = new Headers()
    headers.set('Content-Type', contentType || 'video/mp2t')
    headers.set('Access-Control-Allow-Origin', '*')
    headers.set('Cache-Control', 'public, max-age=3600')

    if (response.headers.get('content-length')) {
      headers.set('Content-Length', response.headers.get('content-length')!)
    }

    return new Response(response.body, { headers })

  } catch (error) {
    console.error('[HLS Proxy] Error:', error)
    return new Response('Proxy error', { status: 500 })
  }
}
