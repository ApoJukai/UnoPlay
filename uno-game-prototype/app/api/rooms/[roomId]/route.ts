import { NextResponse } from "next/server"
import { getPublicRoom, getRoom, isPlayerInRoom } from "@/lib/game-engine"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params
    const url = new URL(request.url)
    const playerId = url.searchParams.get("playerId")

    if (!playerId) {
      return NextResponse.json({ error: "Player ID is required" }, { status: 400 })
    }

    const normalizedId = roomId.toUpperCase()
    const rawRoom = getRoom(normalizedId)
    if (!rawRoom) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    // Check if the player is actually in this room
    if (!isPlayerInRoom(normalizedId, playerId)) {
      return NextResponse.json({ error: "Player not in this room" }, { status: 403 })
    }

    const room = getPublicRoom(normalizedId, playerId)
    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 })
    }

    return NextResponse.json(room)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
