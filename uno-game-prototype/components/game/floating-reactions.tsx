"use client"

import { useEffect, useRef, useState } from "react"
import type { ChatEvent } from "@/lib/game-engine"
import { emojiVisuals } from "./chat-panel"

interface FloatingReaction {
  id: string
  playerName: string
  type: "emoji" | "quickchat"
  content: string
  x: number
  removing: boolean
}

interface FloatingReactionsProps {
  events: ChatEvent[]
  playerId: string
}

export function FloatingReactions({ events, playerId }: FloatingReactionsProps) {
  const [visibleReactions, setVisibleReactions] = useState<FloatingReaction[]>([])
  const processedIds = useRef<Set<string>>(new Set())

  useEffect(() => {
    for (const event of events) {
      if (processedIds.current.has(event.id)) continue
      processedIds.current.add(event.id)

      const reaction: FloatingReaction = {
        id: event.id,
        playerName: event.playerId === playerId ? "You" : event.playerName,
        type: event.type,
        content: event.content,
        x: 15 + Math.random() * 70,
        removing: false,
      }

      setVisibleReactions((prev) => [...prev, reaction])

      // Start fade-out after 2.5s
      setTimeout(() => {
        setVisibleReactions((prev) =>
          prev.map((r) => (r.id === event.id ? { ...r, removing: true } : r))
        )
      }, 2500)

      // Remove after 3.5s
      setTimeout(() => {
        setVisibleReactions((prev) => prev.filter((r) => r.id !== event.id))
      }, 3500)
    }

    // Cleanup old IDs to avoid memory leak
    if (processedIds.current.size > 100) {
      const arr = Array.from(processedIds.current)
      processedIds.current = new Set(arr.slice(-50))
    }
  }, [events, playerId])

  if (visibleReactions.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden" aria-live="polite">
      {visibleReactions.map((reaction) => {
        const isEmoji = reaction.type === "emoji"
        const emojiData = isEmoji ? emojiVisuals[reaction.content] : null

        return (
          <div
            key={reaction.id}
            className="absolute"
            style={{
              left: `${reaction.x}%`,
              bottom: "30%",
              transform: "translateX(-50%)",
              animation: reaction.removing
                ? "floatReactionOut 1s ease-in forwards"
                : "floatReactionIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
            }}
          >
            <div
              className="flex flex-col items-center gap-1"
            >
              {/* Reaction bubble */}
              <div
                className="rounded-2xl px-4 py-2.5 shadow-xl backdrop-blur-md border border-white/10 flex items-center gap-2"
                style={{
                  background: "rgba(20, 40, 30, 0.85)",
                }}
              >
                {isEmoji ? (
                  <span className="text-3xl leading-none" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}>
                    {emojiData?.icon}
                  </span>
                ) : (
                  <span className="text-sm font-semibold text-foreground">{`"${reaction.content}"`}</span>
                )}
              </div>
              {/* Player name tag */}
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: "rgba(20, 40, 30, 0.7)",
                  color: "hsl(45, 100%, 55%)",
                }}
              >
                {reaction.playerName}
              </span>
            </div>
          </div>
        )
      })}

      <style>{`
        @keyframes floatReactionIn {
          0% { opacity: 0; transform: translateX(-50%) translateY(40px) scale(0.5); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
        @keyframes floatReactionOut {
          0% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-60px) scale(0.7); }
        }
      `}</style>
    </div>
  )
}
