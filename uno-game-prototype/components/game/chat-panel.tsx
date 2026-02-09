"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { EMOJI_REACTIONS, QUICK_CHAT_MESSAGES } from "@/lib/game-engine"

const emojiVisuals: Record<string, { icon: string; label: string }> = {
  thumbsup: { icon: "\uD83D\uDC4D", label: "Thumbs Up" },
  fire: { icon: "\uD83D\uDD25", label: "Fire" },
  laugh: { icon: "\uD83D\uDE02", label: "Laughing" },
  cry: { icon: "\uD83D\uDE2D", label: "Crying" },
  angry: { icon: "\uD83D\uDE21", label: "Angry" },
  shock: { icon: "\uD83D\uDE31", label: "Shocked" },
  heart: { icon: "\u2764\uFE0F", label: "Heart" },
  clap: { icon: "\uD83D\uDC4F", label: "Clap" },
}

interface ChatPanelProps {
  onSendEmoji: (emoji: string) => void
  onSendQuickChat: (message: string) => void
  disabled?: boolean
}

export function ChatPanel({ onSendEmoji, onSendQuickChat, disabled }: ChatPanelProps) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<"emoji" | "chat">("emoji")
  const [cooldown, setCooldown] = useState(false)

  function handleSendEmoji(emoji: string) {
    if (cooldown || disabled) return
    onSendEmoji(emoji)
    setCooldown(true)
    setTimeout(() => setCooldown(false), 1500)
    setOpen(false)
  }

  function handleSendChat(msg: string) {
    if (cooldown || disabled) return
    onSendQuickChat(msg)
    setCooldown(true)
    setTimeout(() => setCooldown(false), 1500)
    setOpen(false)
  }

  return (
    <div className="relative">
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        disabled={disabled}
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer",
          open
            ? "bg-primary text-primary-foreground shadow-lg"
            : "bg-secondary/70 text-muted-foreground hover:bg-secondary hover:text-foreground"
        )}
        aria-label="Open chat panel"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {/* Panel */}
      {open && (
        <div
          className="absolute bottom-14 right-0 w-72 rounded-2xl shadow-2xl border border-border/60 overflow-hidden z-50"
          style={{ background: "hsl(145, 35%, 14%)" }}
        >
          {/* Tabs */}
          <div className="flex border-b border-border/40">
            <button
              type="button"
              onClick={() => setTab("emoji")}
              className={cn(
                "flex-1 py-2.5 text-xs font-semibold tracking-wide uppercase transition-colors cursor-pointer",
                tab === "emoji"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Reactions
            </button>
            <button
              type="button"
              onClick={() => setTab("chat")}
              className={cn(
                "flex-1 py-2.5 text-xs font-semibold tracking-wide uppercase transition-colors cursor-pointer",
                tab === "chat"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Quick Chat
            </button>
          </div>

          <div className="p-3">
            {tab === "emoji" ? (
              <div className="grid grid-cols-4 gap-2">
                {EMOJI_REACTIONS.map((emoji) => {
                  const visual = emojiVisuals[emoji]
                  return (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleSendEmoji(emoji)}
                      disabled={cooldown}
                      className={cn(
                        "flex flex-col items-center gap-1 py-2.5 rounded-xl transition-all cursor-pointer",
                        cooldown
                          ? "opacity-40 cursor-not-allowed"
                          : "hover:bg-secondary/60 active:scale-90"
                      )}
                      aria-label={visual?.label}
                    >
                      <span className="text-2xl">{visual?.icon}</span>
                      <span className="text-[10px] text-muted-foreground leading-none">{visual?.label}</span>
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                {QUICK_CHAT_MESSAGES.map((msg) => (
                  <button
                    key={msg}
                    type="button"
                    onClick={() => handleSendChat(msg)}
                    disabled={cooldown}
                    className={cn(
                      "text-left px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer",
                      cooldown
                        ? "opacity-40 cursor-not-allowed text-muted-foreground"
                        : "text-foreground hover:bg-secondary/60 active:scale-[0.98]"
                    )}
                  >
                    {msg}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Export the emoji visuals map for use in the floating reaction display
export { emojiVisuals }
