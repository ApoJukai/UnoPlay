import { NextResponse } from "next/server"
import { playCard } from "@/lib/game-engine"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params
    const { playerId, cardId, chosenColor } = await request.json()

    if (!playerId || !cardId) {
      return NextResponse.json(
        { error: "Player ID and card ID are required" },
        { status: 400 }
      )
    }

    playCard(roomId.toUpperCase(), playerId, cardId, chosenColor)
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
