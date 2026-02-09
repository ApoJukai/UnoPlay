"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AVATARS } from "@/lib/game-engine"
import { UnoCard } from "./uno-card"
import { AvatarSelector } from "./avatar-selector"

interface LandingProps {
  onCreateRoom: (name: string, avatar: string) => void
  onJoinRoom: (name: string, roomId: string, avatar: string) => void
  isLoading: boolean
  error: string | null
  defaultName?: string
  defaultAvatar?: string
}

const decorativeCards = [
  { id: "d1", color: "red" as const, value: "7" as const },
  { id: "d2", color: "blue" as const, value: "draw2" as const },
  { id: "d3", color: "green" as const, value: "reverse" as const },
  { id: "d4", color: "yellow" as const, value: "5" as const },
  { id: "d5", color: "wild" as const, value: "wild" as const },
]

export function Landing({ onCreateRoom, onJoinRoom, isLoading, error, defaultName, defaultAvatar }: LandingProps) {
  const [name, setName] = useState(defaultName || "")
  const [avatar, setAvatar] = useState(defaultAvatar || AVATARS[0])
  const [roomId, setRoomId] = useState("")
  const [mode, setMode] = useState<"idle" | "join">("idle")

  return (
    <main className="min-h-dvh flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative floating cards */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-4 -left-4 rotate-[-25deg] opacity-15 scale-150">
          <UnoCard card={decorativeCards[0]} size="lg" />
        </div>
        <div className="absolute top-20 -right-6 rotate-[20deg] opacity-10 scale-125">
          <UnoCard card={decorativeCards[1]} size="lg" />
        </div>
        <div className="absolute bottom-20 -left-8 rotate-[15deg] opacity-10 scale-125">
          <UnoCard card={decorativeCards[2]} size="lg" />
        </div>
        <div className="absolute -bottom-4 right-10 rotate-[-12deg] opacity-15 scale-150">
          <UnoCard card={decorativeCards[3]} size="lg" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[8deg] opacity-[0.04] scale-[4]">
          <UnoCard card={decorativeCards[4]} size="lg" />
        </div>
      </div>

      <div className="w-full max-w-sm relative z-10">
        {/* Logo with fanned cards */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-5 relative h-24">
            {decorativeCards.slice(0, 5).map((card, i) => {
              const rotations = [-20, -10, 0, 10, 20]
              const offsets = [-30, -15, 0, 15, 30]
              return (
                <div
                  key={card.id}
                  className="absolute transition-transform duration-300"
                  style={{
                    transform: `translateX(${offsets[i]}px) rotate(${rotations[i]}deg)`,
                    zIndex: i,
                  }}
                >
                  <UnoCard card={card} size="sm" />
                </div>
              )
            })}
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-foreground">
            UNO
          </h1>
          <p className="text-lg font-medium mt-1" style={{ color: "hsl(45, 100%, 55%)" }}>
            ONLINE
          </p>
          <p className="text-muted-foreground text-sm mt-2">
            The classic card game, now with friends anywhere
          </p>
        </div>

        {/* Form */}
        <div
          className="rounded-2xl p-6 shadow-2xl border border-border/60 backdrop-blur-md"
          style={{ background: "hsl(145, 35%, 14%)" }}
        >
          {/* Avatar selector */}
          <div className="mb-5">
            <AvatarSelector selected={avatar} onSelect={setAvatar} />
          </div>

          <label htmlFor="display-name" className="block text-sm font-medium text-foreground mb-1.5">
            Your Name
          </label>
          <Input
            id="display-name"
            placeholder="Enter your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            className="mb-5 h-12 bg-secondary border-border text-foreground placeholder:text-muted-foreground text-base rounded-xl"
          />

          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm border" style={{ background: "rgba(215,38,0,0.1)", borderColor: "rgba(215,38,0,0.3)", color: "#ef4444" }}>
              {error}
            </div>
          )}

          {mode === "idle" ? (
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => name.trim() && onCreateRoom(name.trim(), avatar)}
                disabled={!name.trim() || isLoading}
                className="w-full h-13 text-base font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
                style={{ boxShadow: "0 4px 20px hsl(45, 100%, 55%, 0.3)" }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Creating...
                  </span>
                ) : "Create Room"}
              </Button>

              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <Button
                variant="outline"
                onClick={() => setMode("join")}
                disabled={!name.trim()}
                className="w-full h-13 text-base font-bold rounded-xl border-2 border-border text-foreground hover:bg-secondary/80 bg-transparent"
              >
                Join a Room
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <label htmlFor="room-id" className="block text-sm font-medium text-foreground">
                Room Code
              </label>
              <Input
                id="room-id"
                placeholder="XXXXX"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                maxLength={5}
                autoFocus
                className="h-14 bg-secondary border-border text-foreground placeholder:text-muted-foreground tracking-[0.4em] text-center text-2xl font-mono font-bold rounded-xl"
              />
              <Button
                onClick={() => name.trim() && roomId.trim() && onJoinRoom(name.trim(), roomId.trim(), avatar)}
                disabled={!name.trim() || !roomId.trim() || isLoading}
                className="w-full h-13 text-base font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Joining...
                  </span>
                ) : "Join Room"}
              </Button>
              <button
                type="button"
                onClick={() => setMode("idle")}
                className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Back
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-muted-foreground text-xs mt-5 opacity-70">
          2 - 10 players &middot; No account required
        </p>
      </div>
    </main>
  )
}
