import { videoDb } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const sort = searchParams.get("sort")

    let videos = await videoDb.getAll()

    // Filter by category
    if (category && category !== "all") {
      videos = videos.filter((v) => v.category === category)
    }

    // Search
    if (search) {
      videos = videos.filter(
        (v) =>
          v.title.toLowerCase().includes(search.toLowerCase()) ||
          v.instructor.toLowerCase().includes(search.toLowerCase()),
      )
    }

    // Sort
    if (sort === "most-viewed") {
      videos.sort((a, b) => b.views - a.views)
    } else if (sort === "highest-rated") {
      videos.sort((a, b) => b.rating - a.rating)
    } else if (sort === "newest") {
      videos.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }

    return Response.json({ success: true, data: videos })
  } catch (error) {
    return Response.json({ success: false, error: "Failed to fetch videos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const video = await videoDb.create(body)
    return Response.json({ success: true, data: video }, { status: 201 })
  } catch (error) {
    return Response.json({ success: false, error: "Failed to create video" }, { status: 500 })
  }
}
