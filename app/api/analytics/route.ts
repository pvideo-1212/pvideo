import { analyticsDb } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    if (type === "stats") {
      const stats = await analyticsDb.getStats()
      return Response.json({ success: true, data: stats })
    } else if (type === "top-videos") {
      const videos = await analyticsDb.getTopVideos()
      return Response.json({ success: true, data: videos })
    } else if (type === "top-instructors") {
      const instructors = await analyticsDb.getTopInstructors()
      return Response.json({ success: true, data: instructors })
    }

    const stats = await analyticsDb.getStats()
    return Response.json({ success: true, data: stats })
  } catch (error) {
    return Response.json({ success: false, error: "Failed to fetch analytics" }, { status: 500 })
  }
}
