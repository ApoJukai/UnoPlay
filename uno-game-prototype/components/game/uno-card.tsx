"use client"

import { cn } from "@/lib/utils"
import type { Card } from "@/lib/game-engine"

const colorMap: Record<string, { bg: string; shadow: string; ring: string }> = {
  red: { bg: "#D72600", shadow: "#9B1B00", ring: "ring-red-400" },
  blue: { bg: "#0956BF", shadow: "#063D8C", ring: "ring-blue-400" },
  green: { bg: "#379711", shadow: "#276B0C", ring: "ring-green-400" },
  yellow: { bg: "#ECD407", shadow: "#B8A600", ring: "ring-yellow-300" },
  wild: { bg: "#1A1A1A", shadow: "#000000", ring: "ring-gray-400" },
}

function SkipIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" />
      <line x1="10" y1="38" x2="38" y2="10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

function ReverseIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <path d="M14 16L8 24L14 32" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M34 16L40 24L34 32" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="8" y1="24" x2="40" y2="24" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  )
}

function WildQuadrant({ size }: { size: number }) {
  const r = size / 2
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <path d={`M${r},0 A${r},${r} 0 0,1 ${size},${r} L${r},${r} Z`} fill="#D72600" />
      <path d={`M${size},${r} A${r},${r} 0 0,1 ${r},${size} L${r},${r} Z`} fill="#0956BF" />
      <path d={`M${r},${size} A${r},${r} 0 0,1 0,${r} L${r},${r} Z`} fill="#ECD407" />
      <path d={`M0,${r} A${r},${r} 0 0,1 ${r},0 L${r},${r} Z`} fill="#379711" />
    </svg>
  )
}

function getCardSymbol(value: string, isCenterSize: boolean) {
  const size = isCenterSize ? 32 : 14
  switch (value) {
    case "skip":
      return <SkipIcon size={size} />
    case "reverse":
      return <ReverseIcon size={size} />
    case "draw2":
      return <span className={isCenterSize ? "text-2xl font-black" : "text-[9px] font-black leading-none"}>+2</span>
    case "wild":
      return <WildQuadrant size={size} />
    case "wild_draw4":
      return isCenterSize ? (
        <div className="flex flex-col items-center gap-0.5">
          <WildQuadrant size={24} />
          <span className="text-lg font-black leading-none">+4</span>
        </div>
      ) : (
        <span className="text-[9px] font-black leading-none">+4</span>
      )
    default:
      return (
        <span className={cn(isCenterSize ? "text-4xl font-black" : "text-xs font-black leading-none")}>
          {value}
        </span>
      )
  }
}

interface UnoCardProps {
  card: Card
  onClick?: () => void
  disabled?: boolean
  size?: "sm" | "md" | "lg"
  faceDown?: boolean
}

export function UnoCard({ card, onClick, disabled, size = "md", faceDown }: UnoCardProps) {
  const dimensions = {
    sm: { w: 48, h: 72, className: "w-12 h-[72px]" },
    md: { w: 72, h: 108, className: "w-[72px] h-[108px]" },
    lg: { w: 96, h: 144, className: "w-24 h-36" },
  }

  const dim = dimensions[size]

  if (faceDown) {
    return (
      <div
        className={cn(
          dim.className,
          "rounded-xl relative select-none flex-shrink-0"
        )}
        style={{
          background: "#1A1A1A",
          boxShadow: "0 2px 8px rgba(0,0,0,0.4), inset 0 0 0 3px #333",
        }}
      >
        <div className="absolute inset-[6px] rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center">
          <div
            className="w-3/4 h-1/2 rounded-full flex items-center justify-center"
            style={{ background: "#C41E3A" }}
          >
            <span className="text-white font-black text-xs italic tracking-tight">UNO</span>
          </div>
        </div>
      </div>
    )
  }

  const palette = colorMap[card.color] || colorMap.wild
  const isYellow = card.color === "yellow"
  const textColor = isYellow ? "#1A1A1A" : "#FFFFFF"
  const isWild = card.color === "wild"

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        dim.className,
        "rounded-xl relative select-none flex-shrink-0 outline-none transition-all duration-200",
        onClick && !disabled
          ? "cursor-pointer hover:-translate-y-3 hover:scale-105 hover:z-10 active:translate-y-0 active:scale-100 focus-visible:ring-2 focus-visible:ring-offset-2"
          : "",
        disabled ? "opacity-50 cursor-not-allowed saturate-50" : "",
        onClick && !disabled ? palette.ring : ""
      )}
      style={{
        background: palette.bg,
        boxShadow: `0 4px 12px rgba(0,0,0,0.35), inset 0 0 0 3px ${palette.shadow}, 0 1px 0 ${palette.shadow}`,
      }}
    >
      {/* White inner ellipse background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="absolute"
          style={{
            width: "70%",
            height: "85%",
            background: isWild ? "transparent" : "rgba(255,255,255,0.92)",
            borderRadius: "50%",
            transform: "rotate(15deg)",
            boxShadow: isWild ? "none" : "0 0 8px rgba(0,0,0,0.15)",
          }}
        />
      </div>

      {/* Center symbol */}
      <div
        className="absolute inset-0 flex items-center justify-center z-10"
        style={{ color: isWild ? textColor : palette.bg }}
      >
        {getCardSymbol(card.value, true)}
      </div>

      {/* Top-left corner value */}
      <div
        className="absolute top-1.5 left-2 z-10 flex flex-col items-center"
        style={{ color: textColor }}
      >
        {getCardSymbol(card.value, false)}
      </div>

      {/* Bottom-right corner value (rotated 180) */}
      <div
        className="absolute bottom-1.5 right-2 z-10 flex flex-col items-center rotate-180"
        style={{ color: textColor }}
      >
        {getCardSymbol(card.value, false)}
      </div>

      {/* Card border highlight */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)",
        }}
      />
    </button>
  )
}
