import { NextRequest } from "next/server"
import { getVideoById } from "@/lib/static-data"

type RouteContext = {
  params: Promise<{ id: string }>
}

// Get video from static data by ID
export async function GET(request: NextRequest, context: RouteContext) {
  const { id } = await context.params

  // Look up video in static data
  const video = getVideoById(id)

  if (video) {
    return Response.json({
      success: true,
      data: {
        id: video.id,
        title: video.title,
        url: video.url || video.videoUrl,
        thumbnail: video.thumbnail,
        duration: video.duration,
        views: video.views,
        categories: video.categories || [],
        channels: [],
        pornstars: video.models || [],
        videoSources: video.videoSources || []
      }
    })
  }

  // If not found, return constructed data for fallback
  return Response.json({
    success: true,
    data: {
      id,
      title: id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      url: `https://www.wow.xxx/videos/${id}/`,
      thumbnail: '',
      duration: '',
      views: '',
      categories: [],
      channels: [],
      pornstars: [],
      videoSources: []
    }
  })
}
