import { NextRequest } from 'next/server'

type RouteContext = {
  params: Promise<{ id: string }>
}

// Simple API that returns the embed URL for iframe playback
// This is the most reliable approach as it uses eporner's native player
export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params

  if (!id) {
    return Response.json({ error: 'Video ID required' }, { status: 400 })
  }

  console.log('[Video Stream] Returning embed for:', id)

  // Return embed URL for iframe playback
  // This works reliably because eporner's native player handles all authentication
  return Response.json({
    success: true,
    sources: {
      embed: `https://www.eporner.com/embed/${id}/`,
    },
    videoId: id,
    method: 'embed',
  }, {
    headers: {
      'Cache-Control': 'public, max-age=3600', // Cache 1 hour
    }
  })
}
