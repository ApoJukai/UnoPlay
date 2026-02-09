"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { PublicGameRoom, Card } from "@/lib/game-engine"
import { UnoCard } from "./uno-card"
import { ColorPicker } from "./color-picker"
import { AvatarIcon } from "./avatar-icons"
import { ChatPanel } from "./chat-panel"
import { FloatingReactions } from "./floating-reactions"

const activeColorMap: Record<string, string> = {
  red: "#D72600",
  blue: "#0956BF",
  green: "#379711",
  yellow: "#ECD407",
}

interface GameBoardProps {
  room: PublicGameRoom
  playerId: string
  onPlayCard: (cardId: string, chosenColor?: string) => void
  onDrawCard: () => void
  onLeave: () => void
  onSendEmoji: (emoji: string) => void
  onSendQuickChat: (message: string) => void
  isLoading: boolean
}

export function GameBoard({
  room,
  playerId,
  onPlayCard,
  onDrawCard,
  onLeave,
  onSendEmoji,
  onSendQuickChat,
  isLoading,
}: GameBoardProps) {
  const [pendingWildCard, setPendingWildCard] = useState<string | null>(null)

  const myIndex = room.players.findIndex((p) => p.id === playerId)
  const isMyTurn = room.currentPlayerIndex === myIndex
  const currentPlayer = room.players[room.currentPlayerIndex]

  function canPlay(card: Card): boolean {
    if (!isMyTurn) return false
    if (card.color === "wild") return true
    if (card.color === room.currentColor) return true
    if (room.topCard && card.value === room.topCard.value) return true
    return false
  }

  function handleCardClick(card: Card) {
    if (!canPlay(card) || isLoading) return
    if (card.color === "wild") {
      setPendingWildCard(card.id)
    } else {
      onPlayCard(card.id)
    }
  }

  const opponents = room.players.filter((p) => p.id !== playerId)
  const currentColorHex = activeColorMap[room.currentColor] || "#888"

  return (
    <div className="min-h-dvh flex flex-col bg-background">
      {/* Floating Reactions */}
      <FloatingReactions events={room.chatEvents} playerId={playerId} />

      {/* Color Picker Modal */}
      {pendingWildCard && (
        <ColorPicker
          onSelect={(color) => {
            onPlayCard(pendingWildCard, color)
            setPendingWildCard(null)
          }}
          onCancel={() => setPendingWildCard(null)}
        />
      )}

      {/* Top Bar */}
      <header className="flex items-center justify-between px-4 py-2.5 border-b border-border/50 bg-card/60 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-bold text-primary">UNO</span>
          <div className="w-px h-4 bg-border" />
          <span className="text-foreground font-mono font-bold text-sm tracking-wider">{room.id}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={room.direction === -1 ? "scale-x-[-1]" : ""}>
              <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>{room.direction === 1 ? "CW" : "CCW"}</span>
          </div>
          {/* Chat panel trigger */}
          <ChatPanel
            onSendEmoji={onSendEmoji}
            onSendQuickChat={onSendQuickChat}
          />
          <button
            type="button"
            onClick={onLeave}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-secondary/50"
          >
            Leave
          </button>
        </div>
      </header>

      {/* Opponents Row */}
      <div className="flex flex-wrap justify-center gap-2 px-3 py-3">
        {opponents.map((opponent) => {
          const oppIndex = room.players.findIndex((p) => p.id === opponent.id)
          const isTheirTurn = room.currentPlayerIndex === oppIndex
          return (
            <div
              key={opponent.id}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl border transition-all",
                isTheirTurn
                  ? "border-primary/60 shadow-lg"
                  : "border-border/30 bg-card/40"
              )}
              style={isTheirTurn ? {
                background: `linear-gradient(135deg, ${currentColorHex}15, ${currentColorHex}08)`,
                boxShadow: `0 0 20px ${currentColorHex}20`,
              } : undefined}
            >
              <div className="relative">
                <AvatarIcon avatar={opponent.avatar} size={32} />
                {isTheirTurn && (
                  <div
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 animate-pulse"
                    style={{
                      background: currentColorHex,
                      borderColor: "hsl(145, 35%, 14%)",
                    }}
                  />
                )}
              </div>
              <div className="flex flex-col">
                <span className={cn("text-sm font-medium leading-tight", isTheirTurn ? "text-foreground" : "text-muted-foreground")}>
                  {opponent.name}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">
                    {opponent.cardCount} card{opponent.cardCount !== 1 ? "s" : ""}
                  </span>
                  {opponent.cardCount <= 2 && opponent.cardCount > 0 && (
                    <span className="text-[10px] font-bold px-1 py-px rounded" style={{ background: "#D72600", color: "#fff" }}>
                      {opponent.cardCount === 1 ? "UNO!" : "LOW"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Center Play Area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-4 py-2">
        {/* Last Action */}
        {room.lastAction && (
          <p className="text-muted-foreground text-xs text-center max-w-xs px-4 py-1.5 rounded-full bg-card/60 border border-border/30">
            {room.lastAction}
          </p>
        )}

        {/* Table felt area */}
        <div className="flex items-center gap-10">
          {/* Draw pile */}
          <button
            type="button"
            onClick={onDrawCard}
            disabled={!isMyTurn || isLoading}
            className={cn(
              "relative transition-all group",
              isMyTurn && !isLoading
                ? "cursor-pointer hover:scale-105 active:scale-95"
                : "cursor-not-allowed opacity-50"
            )}
            aria-label="Draw a card"
          >
            {/* Stack effect */}
            <div className="absolute top-0.5 left-0.5 w-[72px] h-[108px] rounded-xl opacity-40" style={{ background: "#1A1A1A", boxShadow: "inset 0 0 0 3px #333" }} />
            <div className="absolute top-1 left-1 w-[72px] h-[108px] rounded-xl opacity-20" style={{ background: "#1A1A1A", boxShadow: "inset 0 0 0 3px #333" }} />
            <UnoCard
              card={{ id: "draw", color: "wild", value: "wild" }}
              size="md"
              faceDown
            />
            {isMyTurn && !isLoading && (
              <div
                className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] font-bold whitespace-nowrap px-2 py-0.5 rounded-full"
                style={{ background: currentColorHex, color: room.currentColor === "yellow" ? "#1A1A1A" : "#fff" }}
              >
                DRAW
              </div>
            )}
          </button>

          {/* Discard pile */}
          <div className="relative">
            {/* Shadow cards beneath */}
            <div className="absolute top-1 -left-1 rotate-[-6deg] opacity-30">
              {room.topCard && <UnoCard card={room.topCard} size="md" disabled />}
            </div>
            <div className="relative z-10">
              {room.topCard && <UnoCard card={room.topCard} size="lg" />}
            </div>

            {/* Current color indicator */}
            <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 flex items-center gap-2">
              <div
                className="w-5 h-5 rounded-full shadow-md border-2"
                style={{
                  background: currentColorHex,
                  borderColor: "rgba(255,255,255,0.3)",
                  boxShadow: `0 0 12px ${currentColorHex}80`,
                }}
              />
              <span className="text-xs font-semibold capitalize text-foreground">
                {room.currentColor}
              </span>
            </div>
          </div>
        </div>

        {/* Turn Indicator */}
        <div
          className={cn(
            "mt-10 px-6 py-2.5 rounded-full text-sm font-bold transition-all",
            isMyTurn ? "animate-pulse" : ""
          )}
          style={isMyTurn ? {
            background: currentColorHex,
            color: room.currentColor === "yellow" ? "#1A1A1A" : "#fff",
            boxShadow: `0 4px 24px ${currentColorHex}50`,
          } : {
            background: "hsl(145, 25%, 20%)",
            color: "hsl(145, 15%, 60%)",
          }}
        >
          {isMyTurn ? "Your Turn!" : `${currentPlayer?.name || "..."}'s turn`}
        </div>
      </div>

      {/* Player Hand */}
      <div className="border-t border-border/30 bg-card/50 backdrop-blur-sm">
        <div className="px-2 pt-4 pb-3">
          <div className="flex items-end justify-center">
            <div className="flex overflow-x-auto pb-2 px-2 snap-x gap-0.5 max-w-full" style={{ scrollbarWidth: "thin" }}>
              {room.myCards.map((card, i) => {
                const playable = canPlay(card)
                const total = room.myCards.length
                // Fan effect: slight rotation for aesthetic
                const maxRotation = Math.min(total * 1.5, 15)
                const rotation = total > 1 ? -maxRotation + (i / (total - 1)) * maxRotation * 2 : 0
                const yOffset = Math.abs(rotation) * 0.3

                return (
                  <div
                    key={card.id}
                    className="snap-center flex-shrink-0 transition-all duration-200"
                    style={{
                      transform: `rotate(${rotation}deg) translateY(${yOffset}px)`,
                      marginLeft: i === 0 ? 0 : total > 8 ? -8 : -2,
                      zIndex: i,
                    }}
                  >
                    <UnoCard
                      card={card}
                      size="md"
                      onClick={() => handleCardClick(card)}
                      disabled={!playable || isLoading}
                    />
                  </div>
                )
              })}
            </div>
          </div>
          <p className="text-center text-muted-foreground text-xs mt-2">
            {room.myCards.length} card{room.myCards.length !== 1 ? "s" : ""} in hand
            {room.myCards.length === 1 && (
              <span className="ml-1.5 font-bold" style={{ color: "#D72600" }}>UNO!</span>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
