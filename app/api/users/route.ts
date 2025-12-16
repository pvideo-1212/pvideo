import { userDb } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const users = await userDb.getAll()
    return Response.json({ success: true, data: users })
  } catch (error) {
    return Response.json({ success: false, error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const user = await userDb.create(body)
    return Response.json({ success: true, data: user }, { status: 201 })
  } catch (error) {
    return Response.json({ success: false, error: "Failed to create user" }, { status: 500 })
  }
}
