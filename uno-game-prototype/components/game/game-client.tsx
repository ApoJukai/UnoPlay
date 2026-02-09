"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import useSWR from "swr"
import type { PublicGameRoom } from "@/lib/game-engine"
import { Landing } from "./landing"
import { Lobby } from "./lobby"
import { GameBoard } from "./game-board"
import { GameOver } from "./game-over"

// ---- Session Persistence (localStorage) ----

const SESSION_KEY = "uno_session"

interface UnoSession {
  playerId: string
  playerName: string
  roomId: string | null
}

function getSession(): UnoSession {
  if (typeof window === "undefined") {
    return { playerId: "", playerName: "", roomId: null }
  }
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed.playerId) return parsed
    }
  } catch {
    // corrupted storage
  }
  // Create new player ID
  const playerId = `p_${Math.random().toString(36).slice(2, 10)}_${Date.now()}`
  const session: UnoSession = { playerId, playerName: "", roomId: null }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

function saveSession(session: Partial<UnoSession>) {
  if (typeof window === "undefined") return
  try {
    const current = getSession()
    const updated = { ...current, ...session }
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated))
  } catch {
    // storage full or blocked
  }
}

function clearRoomFromSession() {
  saveSession({ roomId: null })
}

// ---- Fetcher ----

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || "Request failed")
  }
  return res.json()
}

// ---- Component ----

export function GameClient() {
  const [playerId, setPlayerId] = useState("")
  const [playerName, setPlayerName] = useState("")
  const [roomId, setRoomId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [reconnecting, setReconnecting] = useState(true)
  const reconnectAttempted = useRef(false)

  // Hydrate from localStorage on mount
  useEffect(() => {
    const session = getSession()
    setPlayerId(session.playerId)
    setPlayerName(session.playerName)

    // Attempt reconnection if we had an active room
    if (session.roomId && session.playerId && !reconnectAttempted.current) {
      reconnectAttempted.current = true
      attemptReconnect(session.playerId, session.playerName, session.roomId)
    } else if (session.playerId && !session.roomId && !reconnectAttempted.current) {
      // No room saved, but still try to find any active rooms for this player
      reconnectAttempted.current = true
      attemptReconnect(session.playerId, session.playerName, null)
    } else {
      setReconnecting(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function attemptReconnect(pid: string, pname: string, rid: string | null) {
    setReconnecting(true)
    try {
      const res = await fetch("/api/rooms/reconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId: pid, playerName: pname, roomId: rid }),
      })
      const data = await res.json()
      if (data.reconnected && data.room) {
        setRoomId(data.room.id)
        saveSession({ roomId: data.room.id })
      } else {
        // Room no longer exists, clear it
        clearRoomFromSession()
      }
    } catch {
      clearRoomFromSession()
    } finally {
      setReconnecting(false)
    }
  }

  // Poll room state when in a room
  const { data: room, mutate } = useSWR<PublicGameRoom>(
    roomId && playerId ? `/api/rooms/${roomId}?playerId=${playerId}` : null,
    fetcher,
    {
      refreshInterval: 1000,
      revalidateOnFocus: true,
      onError: (err) => {
        if (err.message === "Room not found" || err.message === "Player not in this room") {
          setRoomId(null)
          clearRoomFromSession()
          setError("Room no longer exists or you were removed.")
          setTimeout(() => setError(null), 4000)
        }
      },
    }
  )

  const handleCreateRoom = useCallback(
    async (name: string) => {
      setError(null)
      setActionLoading(true)
      try {
        const res = await fetch("/api/rooms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerId, playerName: name }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        setRoomId(data.roomId)
        setPlayerName(name)
        saveSession({ playerName: name, roomId: data.roomId })
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to create room")
      } finally {
        setActionLoading(false)
      }
    },
    [playerId]
  )

  const handleJoinRoom = useCallback(
    async (name: string, code: string) => {
      setError(null)
      setActionLoading(true)
      try {
        const res = await fetch("/api/rooms/join", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomId: code, playerId, playerName: name }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        const normalizedCode = code.toUpperCase()
        setRoomId(normalizedCode)
        setPlayerName(name)
        saveSession({ playerName: name, roomId: normalizedCode })
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to join room")
      } finally {
        setActionLoading(false)
      }
    },
    [playerId]
  )

  const handleStartGame = useCallback(async () => {
    if (!roomId) return
    setActionLoading(true)
    try {
      const res = await fetch(`/api/rooms/${roomId}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      mutate()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to start game")
    } finally {
      setActionLoading(false)
    }
  }, [roomId, playerId, mutate])

  const handlePlayCard = useCallback(
    async (cardId: string, chosenColor?: string) => {
      if (!roomId) return
      setActionLoading(true)
      try {
        const res = await fetch(`/api/rooms/${roomId}/play`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerId, cardId, chosenColor }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error)
        mutate()
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Invalid move")
        setTimeout(() => setError(null), 3000)
      } finally {
        setActionLoading(false)
      }
    },
    [roomId, playerId, mutate]
  )

  const handleDrawCard = useCallback(async () => {
    if (!roomId) return
    setActionLoading(true)
    try {
      const res = await fetch(`/api/rooms/${roomId}/draw`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      mutate()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Cannot draw")
      setTimeout(() => setError(null), 3000)
    } finally {
      setActionLoading(false)
    }
  }, [roomId, playerId, mutate])

  const handleLeave = useCallback(() => {
    setRoomId(null)
    setError(null)
    clearRoomFromSession()
  }, [])

  // Reconnecting state
  if (reconnecting) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center gap-4 p-4">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-foreground font-medium">Reconnecting to your game...</p>
        </div>
        <p className="text-muted-foreground text-sm">Checking for active sessions</p>
      </main>
    )
  }

  // No room - show landing
  if (!roomId || !room) {
    return (
      <Landing
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
        isLoading={actionLoading}
        error={error}
        defaultName={playerName}
      />
    )
  }

  // Game over
  if (room.state === "finished") {
    return <GameOver room={room} playerId={playerId} onLeave={handleLeave} />
  }

  // In lobby
  if (room.state === "lobby") {
    return (
      <Lobby
        room={room}
        playerId={playerId}
        onStart={handleStartGame}
        onLeave={handleLeave}
        isLoading={actionLoading}
      />
    )
  }

  // Playing
  return (
    <>
      {error && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-900/90 border border-red-700 text-red-200 px-4 py-2 rounded-lg text-sm shadow-lg">
          {error}
        </div>
      )}
      <GameBoard
        room={room}
        playerId={playerId}
        onPlayCard={handlePlayCard}
        onDrawCard={handleDrawCard}
        onLeave={handleLeave}
        isLoading={actionLoading}
      />
    </>
  )
}
