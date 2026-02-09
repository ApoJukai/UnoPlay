import { NextResponse } from "next/server"
import { joinRoom, isPlayerInRoom, reconnectPlayer } from "@/lib/game-engine"

export async function POST(request: Request) {
  try {
    const { roomId, playerId, playerName, avatar } = await request.json()

    if (!roomId || !playerId || !playerName?.trim()) {
      return NextResponse.json(
        { error: "Room ID, player ID, and name are required" },
        { status: 400 }
      )
    }

    const normalizedId = roomId.toUpperCase()

    // If the player is already in this room, treat it as a reconnect
    if (isPlayerInRoom(normalizedId, playerId)) {
      reconnectPlayer(normalizedId, playerId, playerName.trim())
      return NextResponse.json({ success: true, reconnected: true })
    }

    joinRoom(normalizedId, playerId, playerName.trim(), avatar)
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
