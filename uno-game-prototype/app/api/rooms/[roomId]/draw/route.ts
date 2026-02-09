import { NextResponse } from "next/server"
import { drawCard } from "@/lib/game-engine"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params
    const { playerId } = await request.json()

    if (!playerId) {
      return NextResponse.json({ error: "Player ID is required" }, { status: 400 })
    }

    drawCard(roomId.toUpperCase(), playerId)
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
