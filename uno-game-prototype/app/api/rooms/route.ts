import { NextResponse } from "next/server"
import { createRoom } from "@/lib/game-engine"

export async function POST(request: Request) {
  try {
    const { playerId, playerName, avatar } = await request.json()

    if (!playerId || !playerName?.trim()) {
      return NextResponse.json({ error: "Player ID and name are required" }, { status: 400 })
    }

    const room = createRoom(playerId, playerName.trim(), avatar)
    return NextResponse.json({ roomId: room.id })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
