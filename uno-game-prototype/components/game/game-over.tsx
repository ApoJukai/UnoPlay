"use client"

import { Button } from "@/components/ui/button"
import type { PublicGameRoom } from "@/lib/game-engine"
import { UnoCard } from "./uno-card"

const celebrationCards = [
  { id: "c1", color: "red" as const, value: "skip" as const },
  { id: "c2", color: "blue" as const, value: "reverse" as const },
  { id: "c3", color: "wild" as const, value: "wild" as const },
  { id: "c4", color: "green" as const, value: "draw2" as const },
  { id: "c5", color: "yellow" as const, value: "9" as const },
]

interface GameOverProps {
  room: PublicGameRoom
  playerId: string
  onLeave: () => void
}

export function GameOver({ room, playerId, onLeave }: GameOverProps) {
  const winner = room.players.find((p) => p.id === room.winner)
  const isWinner = room.winner === playerId

  const sorted = [...room.players].sort((a, b) => a.cardCount - b.cardCount)
  const placeLabel = (i: number) => {
    if (i === 0) return "1st"
    if (i === 1) return "2nd"
    if (i === 2) return "3rd"
    return `${i + 1}th`
  }

  const medalColors = ["#ECD407", "#C0C0C0", "#CD7F32"]

  return (
    <main className="min-h-dvh flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative scattered cards */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {celebrationCards.map((card, i) => {
          const positions = [
            { top: "5%", left: "5%", rotate: -30 },
            { top: "10%", right: "8%", rotate: 25 },
            { bottom: "15%", left: "3%", rotate: 15 },
            { bottom: "8%", right: "5%", rotate: -20 },
            { top: "45%", left: "85%", rotate: 10 },
          ]
          const pos = positions[i]
          return (
            <div
              key={card.id}
              className="absolute opacity-10"
              style={{
                ...pos,
                transform: `rotate(${pos.rotate}deg)`,
              }}
            >
              <UnoCard card={card} size="lg" />
            </div>
          )
        })}
      </div>

      <div className="w-full max-w-md relative z-10">
        <div
          className="rounded-2xl p-8 shadow-2xl border border-border/60 text-center"
          style={{ background: "hsl(145, 35%, 14%)" }}
        >
          {/* Winner announcement */}
          {isWinner ? (
            <>
              <div className="text-6xl mb-3 flex justify-center">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <path d="M32 4L40 20L58 24L44 38L48 56L32 48L16 56L20 38L6 24L24 20L32 4Z" fill="#ECD407" stroke="#B8A600" strokeWidth="2"/>
                </svg>
              </div>
              <h1 className="text-4xl font-black text-foreground mb-2">
                You Win!
              </h1>
              <p className="text-muted-foreground text-base">
                Congratulations! You played all your cards.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-black text-foreground mb-2">
                Game Over
              </h1>
              <p className="text-muted-foreground text-base">
                <span className="font-semibold text-foreground">{winner?.name || "Someone"}</span> wins the game!
              </p>
            </>
          )}

          {/* Standings */}
          <div className="mt-8 rounded-xl overflow-hidden border border-border/40">
            <div className="px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider" style={{ background: "hsl(145, 25%, 18%)" }}>
              Final Standings
            </div>
            {sorted.map((player, i) => {
              const isYou = player.id === playerId
              return (
                <div
                  key={player.id}
                  className="flex items-center gap-3 px-4 py-3 border-t border-border/20"
                  style={{
                    background: isYou ? "hsl(145, 30%, 20%)" : "transparent",
                  }}
                >
                  {/* Medal / Rank */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                    style={{
                      background: i < 3 ? medalColors[i] : "hsl(145, 25%, 25%)",
                      color: i < 3 ? (i === 0 ? "#1A1A1A" : "#fff") : "hsl(145, 15%, 60%)",
                    }}
                  >
                    {placeLabel(i)}
                  </div>
                  <span className="text-foreground font-medium flex-1 text-left">
                    {player.name}
                    {isYou && <span className="text-muted-foreground text-xs ml-1.5">(You)</span>}
                  </span>
                  <span className="text-sm text-muted-foreground font-mono">
                    {player.cardCount} card{player.cardCount !== 1 ? "s" : ""}
                  </span>
                </div>
              )
            })}
          </div>

          <Button
            onClick={onLeave}
            className="w-full h-13 text-base font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 mt-8 shadow-lg"
            style={{ boxShadow: "0 4px 20px hsl(45, 100%, 55%, 0.3)" }}
          >
            Play Again
          </Button>
        </div>
      </div>
    </main>
  )
}
