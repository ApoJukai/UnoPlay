"use client"

import { cn } from "@/lib/utils"
import { AVATARS } from "@/lib/game-engine"
import { AvatarIcon } from "./avatar-icons"

interface AvatarSelectorProps {
  selected: string
  onSelect: (avatar: string) => void
}

export function AvatarSelector({ selected, onSelect }: AvatarSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground">Choose your avatar</span>
      <div className="grid grid-cols-6 gap-2">
        {AVATARS.map((avatar) => (
          <button
            key={avatar}
            type="button"
            onClick={() => onSelect(avatar)}
            className={cn(
              "w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer p-0.5",
              selected === avatar
                ? "ring-2 ring-primary ring-offset-2 ring-offset-card scale-110"
                : "opacity-60 hover:opacity-100 hover:scale-105"
            )}
          >
            <AvatarIcon avatar={avatar} size={40} />
          </button>
        ))}
      </div>
    </div>
  )
}
