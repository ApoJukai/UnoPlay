"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { PublicGameRoom } from "@/lib/game-engine"
import { AvatarIcon } from "./avatar-icons"

interface LobbyProps {
  room: PublicGameRoom
  playerId: string
  onStart: () => void
  onLeave: () => void
  isLoading: boolean
}

export function Lobby({ room, playerId, onStart, onLeave, isLoading }: LobbyProps) {
  const isHost = room.hostId === playerId
  const [copied, setCopied] = useState(false)

  const copyCode = () => {
    navigator.clipboard.writeText(room.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-dvh flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-4">Waiting for Players</h1>
          
          {/* Room code display */}
          <button
            type="button"
            onClick={copyCode}
            className="group inline-flex flex-col items-center gap-1 px-8 py-4 rounded-2xl border-2 border-dashed border-primary/40 hover:border-primary/70 transition-all cursor-pointer bg-secondary/50"
          >
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Room Code</span>
            <span className="text-4xl font-mono font-black tracking-[0.3em] text-primary">
              {room.id}
            </span>
            <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
              {copied ? "Copied!" : "Click to copy"}
            </span>
          </button>
          <p className="text-muted-foreground text-sm mt-3">Share this code with your friends</p>
        </div>

        <div
          className="rounded-2xl p-6 shadow-2xl border border-border/60"
          style={{ background: "hsl(145, 35%, 14%)" }}
        >
          <h2 className="text-foreground font-semibold mb-4 flex items-center justify-between">
            <span>Players</span>
            <span className="text-sm text-muted-foreground font-normal">{room.players.length}/10</span>
          </h2>

          <div className="flex flex-col gap-2 mb-6">
            {room.players.map((player, index) => {
              const isYou = player.id === playerId
              
              return (
                <div
                  key={player.id}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 border border-border/50"
                  style={{ background: isYou ? "hsl(145, 30%, 20%)" : "hsl(145, 25%, 17%)" }}
                >
                  <AvatarIcon avatar={player.avatar} size={40} />
                  <span className="text-foreground font-medium flex-1 text-base">{player.name}</span>
                  {index === 0 && (
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-semibold"
                      style={{ background: "hsl(45, 100%, 55%)", color: "#1A1A1A" }}
                    >
                      Host
                    </span>
                  )}
                  {isYou && (
                    <span className="text-xs text-muted-foreground italic">You</span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Waiting animation */}
          <div className="flex items-center justify-center gap-1.5 mb-5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-muted-foreground"
                style={{
                  animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
          <style>{`
            @keyframes pulse {
              0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
              40% { opacity: 1; transform: scale(1.2); }
            }
          `}</style>

          <div className="flex flex-col gap-3">
            {isHost && (
              <Button
                onClick={onStart}
                disabled={room.players.length < 2 || isLoading}
                className="w-full h-13 text-base font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
                style={{ boxShadow: "0 4px 20px hsl(45, 100%, 55%, 0.3)" }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Starting...
                  </span>
                ) : "Start Game"}
              </Button>
            )}
            {isHost && room.players.length < 2 && (
              <p className="text-center text-muted-foreground text-xs">
                Need at least 2 players to start
              </p>
            )}
            {!isHost && (
              <p className="text-center text-muted-foreground text-sm py-2">
                Waiting for the host to start the game...
              </p>
            )}
            <button
              type="button"
              onClick={onLeave}
              className="w-full py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer rounded-xl hover:bg-secondary/50"
            >
              Leave Room
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
