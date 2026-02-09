import { NextResponse } from "next/server"
import { findPlayerRooms, reconnectPlayer, getPublicRoom } from "@/lib/game-engine"

// POST: Attempt to reconnect a player to their active game
export async function POST(request: Request) {
  try {
    const { playerId, playerName, roomId } = await request.json()

    if (!playerId) {
      return NextResponse.json({ error: "Player ID is required" }, { status: 400 })
    }

    // If a specific room was provided, try to reconnect to it
    if (roomId) {
      try {
        reconnectPlayer(roomId.toUpperCase(), playerId, playerName)
        const room = getPublicRoom(roomId.toUpperCase(), playerId)
        return NextResponse.json({ reconnected: true, room })
      } catch {
        return NextResponse.json({ reconnected: false, rooms: [] })
      }
    }

    // Otherwise, find all rooms this player belongs to
    const playerRooms = findPlayerRooms(playerId)

    if (playerRooms.length === 0) {
      return NextResponse.json({ reconnected: false, rooms: [] })
    }

    // Prefer active (playing) games, then lobbies, skip finished
    const activeRoom = playerRooms.find((r) => r.state === "playing")
      || playerRooms.find((r) => r.state === "lobby")

    if (activeRoom) {
      reconnectPlayer(activeRoom.roomId, playerId, playerName)
      const room = getPublicRoom(activeRoom.roomId, playerId)
      return NextResponse.json({ reconnected: true, room })
    }

    return NextResponse.json({ reconnected: false, rooms: playerRooms })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
