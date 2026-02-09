// =============================================
// UNO Game Engine - Server-Side Logic
// =============================================

export type CardColor = "red" | "blue" | "green" | "yellow" | "wild"
export type CardValue =
  | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
  | "skip" | "reverse" | "draw2"
  | "wild" | "wild_draw4"

export interface Card {
  id: string
  color: CardColor
  value: CardValue
}

export interface Player {
  id: string
  name: string
  avatar: string
  cards: Card[]
}

// Predefined avatar options
export const AVATARS = [
  "fox", "cat", "dog", "panda", "koala",
  "lion", "owl", "frog", "penguin", "rabbit",
  "bear", "tiger",
] as const

export type AvatarId = typeof AVATARS[number]

// Quick chat presets
export const QUICK_CHAT_MESSAGES = [
  "Nice move!",
  "Hurry up!",
  "Oops!",
  "Well played!",
  "No way!",
  "Good game!",
  "Uno!",
  "Oh no...",
] as const

export type QuickChatMessage = typeof QUICK_CHAT_MESSAGES[number]

// Emoji reaction
export interface ChatEvent {
  id: string
  playerId: string
  playerName: string
  type: "emoji" | "quickchat"
  content: string
  timestamp: number
}

// Available emoji reactions
export const EMOJI_REACTIONS = [
  "thumbsup", "fire", "laugh", "cry",
  "angry", "shock", "heart", "clap",
] as const

export type EmojiReaction = typeof EMOJI_REACTIONS[number]

export interface GameRoom {
  id: string
  hostId: string
  players: Player[]
  state: "lobby" | "playing" | "finished"
  deck: Card[]
  discardPile: Card[]
  currentPlayerIndex: number
  direction: 1 | -1
  currentColor: string
  winner: string | null
  lastAction: string
  chatEvents: ChatEvent[]
  version: number
}

// Public view of a room (hides other players' cards)
export interface PublicGameRoom {
  id: string
  hostId: string
  players: { id: string; name: string; avatar: string; cardCount: number }[]
  state: "lobby" | "playing" | "finished"
  myCards: Card[]
  topCard: Card | null
  currentPlayerIndex: number
  direction: 1 | -1
  currentColor: string
  winner: string | null
  lastAction: string
  chatEvents: ChatEvent[]
  version: number
}

// In-memory storage
const rooms: Map<string, GameRoom> = new Map()

// ---- Utility Functions ----

let cardIdCounter = 0
function nextCardId(): string {
  return `card_${++cardIdCounter}_${Date.now()}`
}

function generateRoomId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let result = ""
  for (let i = 0; i < 5; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// ---- Deck Creation ----

function createDeck(): Card[] {
  const colors: CardColor[] = ["red", "blue", "green", "yellow"]
  const deck: Card[] = []

  for (const color of colors) {
    // One 0 per color
    deck.push({ id: nextCardId(), color, value: "0" })

    // Two of each 1-9
    for (let n = 1; n <= 9; n++) {
      deck.push({ id: nextCardId(), color, value: String(n) as CardValue })
      deck.push({ id: nextCardId(), color, value: String(n) as CardValue })
    }

    // Two of each action card per color
    const actions: CardValue[] = ["skip", "reverse", "draw2"]
    for (const action of actions) {
      deck.push({ id: nextCardId(), color, value: action })
      deck.push({ id: nextCardId(), color, value: action })
    }
  }

  // 4 Wild and 4 Wild Draw Four
  for (let i = 0; i < 4; i++) {
    deck.push({ id: nextCardId(), color: "wild", value: "wild" })
    deck.push({ id: nextCardId(), color: "wild", value: "wild_draw4" })
  }

  return deck
}

// ---- Room Management ----

export function createRoom(hostId: string, hostName: string, hostAvatar?: string): GameRoom {
  let roomId = generateRoomId()
  // Ensure uniqueness
  while (rooms.has(roomId)) {
    roomId = generateRoomId()
  }

  const room: GameRoom = {
    id: roomId,
    hostId,
    players: [{ id: hostId, name: hostName, avatar: hostAvatar || AVATARS[0], cards: [] }],
    state: "lobby",
    deck: [],
    discardPile: [],
    currentPlayerIndex: 0,
    direction: 1,
    currentColor: "",
    winner: null,
    lastAction: `${hostName} created the room.`,
    chatEvents: [],
    version: 1,
  }

  rooms.set(roomId, room)
  return room
}

export function joinRoom(roomId: string, playerId: string, playerName: string, playerAvatar?: string): GameRoom {
  const room = rooms.get(roomId)
  if (!room) throw new Error("Room not found")
  if (room.state !== "lobby") throw new Error("Game already started")
  if (room.players.length >= 10) throw new Error("Room is full (max 10 players)")

  // Check if player already in room
  const existing = room.players.find((p) => p.id === playerId)
  if (existing) {
    existing.name = playerName
    if (playerAvatar) existing.avatar = playerAvatar
    room.version++
    return room
  }

  const assignedAvatar = playerAvatar || AVATARS[room.players.length % AVATARS.length]
  room.players.push({ id: playerId, name: playerName, avatar: assignedAvatar, cards: [] })
  room.lastAction = `${playerName} joined the room.`
  room.version++
  return room
}

export function getRoom(roomId: string): GameRoom | null {
  return rooms.get(roomId) || null
}

// Check if a player is in a specific room (any state)
export function isPlayerInRoom(roomId: string, playerId: string): boolean {
  const room = rooms.get(roomId)
  if (!room) return false
  return room.players.some((p) => p.id === playerId)
}

// Reconnect a player: allows rejoining a room they were already part of,
// even if the game is in progress or finished. Optionally updates their name.
export function reconnectPlayer(
  roomId: string,
  playerId: string,
  playerName?: string
): GameRoom {
  const room = rooms.get(roomId)
  if (!room) throw new Error("Room not found")

  const existingPlayer = room.players.find((p) => p.id === playerId)
  if (!existingPlayer) {
    // If the game hasn't started yet, allow joining as a new player
    if (room.state === "lobby") {
      if (!playerName?.trim()) throw new Error("Name is required to join")
      return joinRoom(roomId, playerId, playerName.trim())
    }
    throw new Error("You are not part of this game")
  }

  // Update name if provided
  if (playerName?.trim()) {
    existingPlayer.name = playerName.trim()
  }

  return room
}

// Find all rooms a player is currently in (for reconnection discovery)
export function findPlayerRooms(playerId: string): { roomId: string; state: string; playerCount: number }[] {
  const result: { roomId: string; state: string; playerCount: number }[] = []
  rooms.forEach((room) => {
    if (room.players.some((p) => p.id === playerId)) {
      result.push({
        roomId: room.id,
        state: room.state,
        playerCount: room.players.length,
      })
    }
  })
  return result
}

// ---- Chat / Emoji ----

let chatIdCounter = 0

export function sendChatEvent(
  roomId: string,
  playerId: string,
  type: "emoji" | "quickchat",
  content: string
): GameRoom {
  const room = rooms.get(roomId)
  if (!room) throw new Error("Room not found")

  const player = room.players.find((p) => p.id === playerId)
  if (!player) throw new Error("Player not in room")

  const event: ChatEvent = {
    id: `chat_${++chatIdCounter}`,
    playerId,
    playerName: player.name,
    type,
    content,
    timestamp: Date.now(),
  }

  room.chatEvents.push(event)

  // Keep only the last 20 events to avoid memory bloat
  if (room.chatEvents.length > 20) {
    room.chatEvents = room.chatEvents.slice(-20)
  }

  room.version++
  return room
}

export function updatePlayerAvatar(
  roomId: string,
  playerId: string,
  avatar: string
): GameRoom {
  const room = rooms.get(roomId)
  if (!room) throw new Error("Room not found")

  const player = room.players.find((p) => p.id === playerId)
  if (!player) throw new Error("Player not in room")

  player.avatar = avatar
  room.version++
  return room
}

// ---- Game Start ----

export function startGame(roomId: string, playerId: string): GameRoom {
  const room = rooms.get(roomId)
  if (!room) throw new Error("Room not found")
  if (room.hostId !== playerId) throw new Error("Only the host can start the game")
  if (room.players.length < 2) throw new Error("Need at least 2 players to start")
  if (room.state !== "lobby") throw new Error("Game already started")

  // Create and shuffle deck
  room.deck = shuffle(createDeck())

  // Deal 7 cards to each player
  for (const player of room.players) {
    player.cards = room.deck.splice(0, 7)
  }

  // Flip top card for discard pile - keep drawing until it's a number card
  let topCard = room.deck.shift()!
  while (topCard.color === "wild" || ["skip", "reverse", "draw2"].includes(topCard.value)) {
    room.deck.push(topCard)
    room.deck = shuffle(room.deck)
    topCard = room.deck.shift()!
  }

  room.discardPile = [topCard]
  room.currentColor = topCard.color
  room.currentPlayerIndex = 0
  room.direction = 1
  room.state = "playing"
  room.lastAction = "Game started!"
  room.version++

  return room
}

// ---- Card Playing ----

function canPlayCard(card: Card, topCard: Card, currentColor: string): boolean {
  // Wild cards can always be played
  if (card.color === "wild") return true
  // Match color
  if (card.color === currentColor) return true
  // Match value/number
  if (card.value === topCard.value) return true
  return false
}

function advanceTurn(room: GameRoom): void {
  room.currentPlayerIndex =
    (room.currentPlayerIndex + room.direction + room.players.length) % room.players.length
}

function reshuffleDeckIfNeeded(room: GameRoom): void {
  if (room.deck.length === 0 && room.discardPile.length > 1) {
    const topCard = room.discardPile.pop()!
    room.deck = shuffle(room.discardPile)
    room.discardPile = [topCard]
  }
}

export function playCard(
  roomId: string,
  playerId: string,
  cardId: string,
  chosenColor?: string
): GameRoom {
  const room = rooms.get(roomId)
  if (!room) throw new Error("Room not found")
  if (room.state !== "playing") throw new Error("Game is not in progress")

  const currentPlayer = room.players[room.currentPlayerIndex]
  if (currentPlayer.id !== playerId) throw new Error("It's not your turn")

  const cardIndex = currentPlayer.cards.findIndex((c) => c.id === cardId)
  if (cardIndex === -1) throw new Error("Card not found in your hand")

  const card = currentPlayer.cards[cardIndex]
  const topCard = room.discardPile[room.discardPile.length - 1]

  if (!canPlayCard(card, topCard, room.currentColor)) {
    throw new Error("Cannot play this card")
  }

  // Remove card from hand
  currentPlayer.cards.splice(cardIndex, 1)

  // Add to discard pile
  room.discardPile.push(card)

  // Update current color
  if (card.color === "wild") {
    if (!chosenColor || !["red", "blue", "green", "yellow"].includes(chosenColor)) {
      throw new Error("Must choose a color for wild card")
    }
    room.currentColor = chosenColor
  } else {
    room.currentColor = card.color
  }

  // Check win condition
  if (currentPlayer.cards.length === 0) {
    room.state = "finished"
    room.winner = currentPlayer.id
    room.lastAction = `${currentPlayer.name} wins!`
    room.version++
    return room
  }

  // Handle action cards
  const playerName = currentPlayer.name
  const colorLabel = card.color === "wild" ? chosenColor : card.color

  switch (card.value) {
    case "skip": {
      advanceTurn(room) // skip the next player
      const skippedPlayer = room.players[room.currentPlayerIndex]
      room.lastAction = `${playerName} played Skip! ${skippedPlayer.name} was skipped.`
      advanceTurn(room) // move to the player after
      break
    }
    case "reverse": {
      room.direction *= -1
      if (room.players.length === 2) {
        // In 2-player game, reverse acts like skip
        room.lastAction = `${playerName} played Reverse!`
        advanceTurn(room)
        advanceTurn(room)
      } else {
        room.lastAction = `${playerName} played Reverse! Direction changed.`
        advanceTurn(room)
      }
      break
    }
    case "draw2": {
      advanceTurn(room)
      const targetPlayer = room.players[room.currentPlayerIndex]
      reshuffleDeckIfNeeded(room)
      for (let i = 0; i < 2; i++) {
        reshuffleDeckIfNeeded(room)
        if (room.deck.length > 0) {
          targetPlayer.cards.push(room.deck.shift()!)
        }
      }
      room.lastAction = `${playerName} played Draw Two! ${targetPlayer.name} draws 2 cards.`
      advanceTurn(room) // skip the drawing player's turn
      break
    }
    case "wild": {
      room.lastAction = `${playerName} played Wild! Color is now ${colorLabel}.`
      advanceTurn(room)
      break
    }
    case "wild_draw4": {
      advanceTurn(room)
      const target = room.players[room.currentPlayerIndex]
      for (let i = 0; i < 4; i++) {
        reshuffleDeckIfNeeded(room)
        if (room.deck.length > 0) {
          target.cards.push(room.deck.shift()!)
        }
      }
      room.lastAction = `${playerName} played Wild Draw Four! ${target.name} draws 4 cards. Color is now ${colorLabel}.`
      advanceTurn(room) // skip the drawing player's turn
      break
    }
    default: {
      room.lastAction = `${playerName} played ${colorLabel} ${card.value}.`
      advanceTurn(room)
    }
  }

  room.version++
  return room
}

// ---- Draw Card ----

export function drawCard(roomId: string, playerId: string): GameRoom {
  const room = rooms.get(roomId)
  if (!room) throw new Error("Room not found")
  if (room.state !== "playing") throw new Error("Game is not in progress")

  const currentPlayer = room.players[room.currentPlayerIndex]
  if (currentPlayer.id !== playerId) throw new Error("It's not your turn")

  reshuffleDeckIfNeeded(room)

  if (room.deck.length > 0) {
    currentPlayer.cards.push(room.deck.shift()!)
  }

  room.lastAction = `${currentPlayer.name} drew a card.`
  advanceTurn(room)
  room.version++

  return room
}

// ---- Public View ----

export function getPublicRoom(roomId: string, playerId: string): PublicGameRoom | null {
  const room = rooms.get(roomId)
  if (!room) return null

  const myPlayer = room.players.find((p) => p.id === playerId)

  return {
    id: room.id,
    hostId: room.hostId,
    players: room.players.map((p) => ({
      id: p.id,
      name: p.name,
      avatar: p.avatar,
      cardCount: p.cards.length,
    })),
    state: room.state,
    myCards: myPlayer ? myPlayer.cards : [],
    topCard: room.discardPile.length > 0 ? room.discardPile[room.discardPile.length - 1] : null,
    currentPlayerIndex: room.currentPlayerIndex,
    direction: room.direction,
    currentColor: room.currentColor,
    winner: room.winner,
    lastAction: room.lastAction,
    chatEvents: room.chatEvents.filter((e) => e.timestamp > Date.now() - 10000),
    version: room.version,
  }
}
