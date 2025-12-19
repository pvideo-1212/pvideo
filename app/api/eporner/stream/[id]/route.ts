import { NextRequest } from 'next/server'

type RouteContext = {
  params: Promise<{ id: string }>
}

// This API returns video embed info
// Since the user is in India where eporner is blocked, we provide the embed URL
// The embed iframe loads in the browser and works regardless of server location
export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params

  if (!id) {
    return Response.json({ error: 'Video ID required' }, { status: 400 })
  }

  console.log('[Video Stream] Returning embed for:', id)

  // Directly return the embed URL - this is the most reliable approach
  // The iframe will load in the user's browser and handle video playback
  return Response.json({
    success: true,
    sources: {
      hls: [],
      mp4: [],
      embed: `https://www.eporner.com/embed/${id}/`,
    },
    videoId: id,
    method: 'embed',
  })
}

