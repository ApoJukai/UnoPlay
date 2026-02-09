import { NextResponse } from "next/server"
import { sendChatEvent, EMOJI_REACTIONS, QUICK_CHAT_MESSAGES } from "@/lib/game-engine"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const { roomId } = await params
    const { playerId, type, content } = await request.json()

    if (!playerId || !type || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (type !== "emoji" && type !== "quickchat") {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 })
    }

    // Validate content
    if (type === "emoji" && !EMOJI_REACTIONS.includes(content)) {
      return NextResponse.json({ error: "Invalid emoji" }, { status: 400 })
    }
    if (type === "quickchat" && !QUICK_CHAT_MESSAGES.includes(content)) {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 })
    }

    sendChatEvent(roomId.toUpperCase(), playerId, type, content)
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
