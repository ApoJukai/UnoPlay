import React from "react"
import type { Metadata, Viewport } from 'next'
import { Fredoka, Geist_Mono } from 'next/font/google'

import './globals.css'

const _fredoka = Fredoka({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'UNO Online - Multiplayer Card Game',
  description: 'Play UNO online with friends in real-time. Create a room, invite your friends, and enjoy the classic card game!',
}

export const viewport: Viewport = {
  themeColor: '#1a3a2a',
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased min-h-dvh">{children}</body>
    </html>
  )
}
