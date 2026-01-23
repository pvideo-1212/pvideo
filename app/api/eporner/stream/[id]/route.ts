import { NextRequest } from 'next/server'

type RouteContext = {
  params: Promise<{ id: string }>
}

interface VideoSource {
  src: string
  quality: string
  type: 'hls' | 'mp4' | 'embed'
  label: string
}

// Extract direct video URLs from Eporner video page
async function extractVideoSources(videoId: string): Promise<VideoSource[]> {
  const sources: VideoSource[] = []

  try {
    // Try to fetch the video info from Eporner's dload API
    // This API returns download links with quality options
    const dloadUrl = `https://www.eporner.com/dload/${videoId}/`

    const proxyUrls = [
      `https://corsproxy.io/?${encodeURIComponent(dloadUrl)}`,
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(dloadUrl)}`,
    ]

    let html = ''

    for (const proxyUrl of proxyUrls) {
      try {
        const response = await fetch(proxyUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
          },
          signal: AbortSignal.timeout(10000),
        })

        if (response.ok) {
          html = await response.text()
          break
        }
      } catch (e) {
        console.log('[Stream Extract] Proxy failed:', (e as Error).message?.slice(0, 50))
      }
    }

    if (html) {
      // Extract MP4 download links from the download page
      // Pattern: href="...eporner.../download/...mp4" with quality labels
      const mp4Pattern = /href="(https?:\/\/[^"]+\.mp4[^"]*)"/gi
      const qualityPattern = /(\d{3,4}p)/i

      let match
      while ((match = mp4Pattern.exec(html)) !== null) {
        const url = match[1]
        // Extract quality from surrounding text or URL
        const qualityMatch = html.slice(Math.max(0, match.index - 100), match.index + 200).match(qualityPattern)
        const quality = qualityMatch ? qualityMatch[1] : 'SD'

        sources.push({
          src: url,
          quality: quality,
          type: 'mp4',
          label: `MP4 ${quality}`
        })
      }

      // Also try to extract HLS m3u8 sources from script tags
      // Eporner typically has: EP.video.player.sources = [{...}]
      const m3u8Pattern = /["'](https?:\/\/[^"']+\.m3u8[^"']*)["']/gi
      while ((match = m3u8Pattern.exec(html)) !== null) {
        sources.push({
          src: match[1],
          quality: 'Auto',
          type: 'hls',
          label: 'HLS Auto'
        })
      }
    }

    // If we found sources, return them sorted by quality (highest first)
    if (sources.length > 0) {
      return sources.sort((a, b) => {
        const getQualityNum = (q: string) => parseInt(q.match(/\d+/)?.[0] || '0')
        return getQualityNum(b.quality) - getQualityNum(a.quality)
      })
    }
  } catch (error) {
    console.error('[Stream Extract] Error:', error)
  }

  // Return empty array if extraction failed
  return []
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params

  if (!id) {
    return Response.json({ error: 'Video ID required' }, { status: 400 })
  }

  console.log('[Video Stream] Extracting sources for:', id)

  // Try to extract direct video sources
  const directSources = await extractVideoSources(id)

  // Always include embed as fallback
  const embedSource: VideoSource = {
    src: `https://www.eporner.com/embed/${id}/`,
    quality: 'HD',
    type: 'embed',
    label: 'Embed Player'
  }

  const allSources = directSources.length > 0
    ? [...directSources, embedSource]
    : [embedSource]

  console.log('[Video Stream] Found', directSources.length, 'direct sources')

  return Response.json({
    success: true,
    sources: allSources,
    videoId: id,
    method: directSources.length > 0 ? 'direct' : 'embed',
    hasDirectSources: directSources.length > 0,
  }, {
    headers: {
      'Cache-Control': 'public, max-age=1800', // Cache 30 min
    }
  })
}
