import { NextRequest, NextResponse } from "next/server"

// No Redis - just acknowledge tracking request
export async function POST(req: NextRequest) {
  return NextResponse.json({ success: true })
}
