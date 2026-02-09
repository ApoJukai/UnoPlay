"use client"

const avatarData: Record<string, { bg: string; label: string; paths: string }> = {
  fox: {
    bg: "#E8792B",
    label: "Fox",
    paths: `<circle cx="24" cy="26" r="12" fill="#E8792B"/>
      <ellipse cx="24" cy="30" rx="6" ry="4" fill="#FDEBD0"/>
      <circle cx="20" cy="24" r="1.5" fill="#2D2D2D"/>
      <circle cx="28" cy="24" r="1.5" fill="#2D2D2D"/>
      <path d="M22 29 Q24 31 26 29" stroke="#2D2D2D" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <polygon points="15,14 18,22 12,22" fill="#E8792B"/>
      <polygon points="33,14 30,22 36,22" fill="#E8792B"/>
      <polygon points="16,16 18,22 14,20" fill="#FDEBD0"/>
      <polygon points="32,16 30,22 34,20" fill="#FDEBD0"/>`,
  },
  cat: {
    bg: "#7C7C7C",
    label: "Cat",
    paths: `<circle cx="24" cy="26" r="12" fill="#7C7C7C"/>
      <ellipse cx="24" cy="30" rx="5" ry="3.5" fill="#E0E0E0"/>
      <ellipse cx="21" cy="24" rx="2" ry="2.5" fill="#A8D65B"/>
      <ellipse cx="27" cy="24" rx="2" ry="2.5" fill="#A8D65B"/>
      <circle cx="21" cy="24" r="1" fill="#2D2D2D"/>
      <circle cx="27" cy="24" r="1" fill="#2D2D2D"/>
      <path d="M23 28.5 L24 29.5 L25 28.5" stroke="#2D2D2D" strokeWidth="0.8" fill="#FFB6C1"/>
      <polygon points="14,13 17,23 11,21" fill="#7C7C7C"/>
      <polygon points="34,13 31,23 37,21" fill="#7C7C7C"/>
      <polygon points="15,15 17,23 13,19" fill="#FFB6C1"/>
      <polygon points="33,15 31,23 35,19" fill="#FFB6C1"/>`,
  },
  dog: {
    bg: "#C08B5C",
    label: "Dog",
    paths: `<circle cx="24" cy="26" r="12" fill="#C08B5C"/>
      <ellipse cx="24" cy="30" rx="6" ry="4.5" fill="#E8D5B7"/>
      <circle cx="20" cy="24" r="2" fill="#fff"/>
      <circle cx="28" cy="24" r="2" fill="#fff"/>
      <circle cx="20" cy="24" r="1.2" fill="#2D2D2D"/>
      <circle cx="28" cy="24" r="1.2" fill="#2D2D2D"/>
      <ellipse cx="24" cy="28" rx="2.5" ry="1.8" fill="#2D2D2D"/>
      <path d="M22 31 Q24 33 26 31" stroke="#2D2D2D" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
      <ellipse cx="15" cy="22" rx="4" ry="7" fill="#A0724A" transform="rotate(-15 15 22)"/>
      <ellipse cx="33" cy="22" rx="4" ry="7" fill="#A0724A" transform="rotate(15 33 22)"/>`,
  },
  panda: {
    bg: "#F5F5F5",
    label: "Panda",
    paths: `<circle cx="24" cy="26" r="12" fill="#F5F5F5"/>
      <ellipse cx="20" cy="23" rx="4" ry="3.5" fill="#2D2D2D"/>
      <ellipse cx="28" cy="23" rx="4" ry="3.5" fill="#2D2D2D"/>
      <circle cx="20" cy="23" r="1.5" fill="#fff"/>
      <circle cx="28" cy="23" r="1.5" fill="#fff"/>
      <ellipse cx="24" cy="28" rx="2" ry="1.5" fill="#2D2D2D"/>
      <path d="M22 30 Q24 32 26 30" stroke="#2D2D2D" strokeWidth="0.8" fill="none"/>
      <circle cx="15" cy="16" r="4" fill="#2D2D2D"/>
      <circle cx="33" cy="16" r="4" fill="#2D2D2D"/>`,
  },
  koala: {
    bg: "#8B9DC3",
    label: "Koala",
    paths: `<circle cx="24" cy="26" r="12" fill="#8B9DC3"/>
      <ellipse cx="24" cy="30" rx="5" ry="4" fill="#C9D1E3"/>
      <circle cx="20" cy="24" r="1.5" fill="#2D2D2D"/>
      <circle cx="28" cy="24" r="1.5" fill="#2D2D2D"/>
      <ellipse cx="24" cy="28.5" rx="3" ry="2" fill="#4A4A6A"/>
      <circle cx="14" cy="19" r="5" fill="#8B9DC3"/>
      <circle cx="14" cy="19" r="3" fill="#C9D1E3"/>
      <circle cx="34" cy="19" r="5" fill="#8B9DC3"/>
      <circle cx="34" cy="19" r="3" fill="#C9D1E3"/>`,
  },
  lion: {
    bg: "#D4A843",
    label: "Lion",
    paths: `<circle cx="24" cy="26" r="14" fill="#C4872C"/>
      <circle cx="24" cy="27" r="10" fill="#D4A843"/>
      <ellipse cx="24" cy="30" rx="5" ry="3.5" fill="#F2DDA4"/>
      <circle cx="20" cy="24" r="1.5" fill="#2D2D2D"/>
      <circle cx="28" cy="24" r="1.5" fill="#2D2D2D"/>
      <ellipse cx="24" cy="28" rx="2" ry="1.2" fill="#2D2D2D"/>
      <path d="M22 31 Q24 33 26 31" stroke="#2D2D2D" strokeWidth="0.8" fill="none"/>`,
  },
  owl: {
    bg: "#6B4C3B",
    label: "Owl",
    paths: `<circle cx="24" cy="26" r="12" fill="#6B4C3B"/>
      <circle cx="19" cy="24" r="4" fill="#F5F0DC"/>
      <circle cx="29" cy="24" r="4" fill="#F5F0DC"/>
      <circle cx="19" cy="24" r="2" fill="#2D2D2D"/>
      <circle cx="29" cy="24" r="2" fill="#2D2D2D"/>
      <polygon points="24,26 22,28 26,28" fill="#E8A832"/>
      <polygon points="16,15 19,22 13,18" fill="#6B4C3B"/>
      <polygon points="32,15 29,22 35,18" fill="#6B4C3B"/>
      <ellipse cx="24" cy="33" rx="6" ry="3" fill="#8B6B52"/>`,
  },
  frog: {
    bg: "#5CB85C",
    label: "Frog",
    paths: `<circle cx="24" cy="28" r="12" fill="#5CB85C"/>
      <circle cx="18" cy="20" r="5" fill="#5CB85C"/>
      <circle cx="30" cy="20" r="5" fill="#5CB85C"/>
      <circle cx="18" cy="20" r="3" fill="#fff"/>
      <circle cx="30" cy="20" r="3" fill="#fff"/>
      <circle cx="18" cy="20" r="1.5" fill="#2D2D2D"/>
      <circle cx="30" cy="20" r="1.5" fill="#2D2D2D"/>
      <path d="M18 31 Q24 35 30 31" stroke="#3D8B3D" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <ellipse cx="24" cy="34" rx="7" ry="3" fill="#A5D6A5"/>`,
  },
  penguin: {
    bg: "#2D2D2D",
    label: "Penguin",
    paths: `<circle cx="24" cy="26" r="12" fill="#2D2D2D"/>
      <ellipse cx="24" cy="30" rx="7" ry="8" fill="#F5F5F5"/>
      <circle cx="20" cy="23" r="1.5" fill="#fff"/>
      <circle cx="28" cy="23" r="1.5" fill="#fff"/>
      <circle cx="20" cy="23" r="0.8" fill="#2D2D2D"/>
      <circle cx="28" cy="23" r="0.8" fill="#2D2D2D"/>
      <polygon points="24,25 22,27 26,27" fill="#E8A832"/>`,
  },
  rabbit: {
    bg: "#F5E0D0",
    label: "Rabbit",
    paths: `<circle cx="24" cy="28" r="10" fill="#F5E0D0"/>
      <ellipse cx="19" cy="14" rx="3.5" ry="9" fill="#F5E0D0"/>
      <ellipse cx="29" cy="14" rx="3.5" ry="9" fill="#F5E0D0"/>
      <ellipse cx="19" cy="14" rx="2" ry="7" fill="#FFB6C1"/>
      <ellipse cx="29" cy="14" rx="2" ry="7" fill="#FFB6C1"/>
      <circle cx="20" cy="26" r="1.5" fill="#2D2D2D"/>
      <circle cx="28" cy="26" r="1.5" fill="#2D2D2D"/>
      <ellipse cx="24" cy="30" rx="1.5" ry="1" fill="#FFB6C1"/>
      <path d="M22 32 Q24 33 26 32" stroke="#C49080" strokeWidth="0.8" fill="none"/>
      <circle cx="18" cy="30" r="2.5" fill="#FFB6C180"/>
      <circle cx="30" cy="30" r="2.5" fill="#FFB6C180"/>`,
  },
  bear: {
    bg: "#8B5E3C",
    label: "Bear",
    paths: `<circle cx="24" cy="26" r="12" fill="#8B5E3C"/>
      <circle cx="16" cy="17" r="4" fill="#8B5E3C"/>
      <circle cx="16" cy="17" r="2.5" fill="#6B4426"/>
      <circle cx="32" cy="17" r="4" fill="#8B5E3C"/>
      <circle cx="32" cy="17" r="2.5" fill="#6B4426"/>
      <ellipse cx="24" cy="30" rx="6" ry="5" fill="#C4956A"/>
      <circle cx="20" cy="24" r="1.5" fill="#2D2D2D"/>
      <circle cx="28" cy="24" r="1.5" fill="#2D2D2D"/>
      <ellipse cx="24" cy="28" rx="2.5" ry="1.8" fill="#2D2D2D"/>
      <path d="M22 31 Q24 33 26 31" stroke="#2D2D2D" strokeWidth="0.8" fill="none"/>`,
  },
  tiger: {
    bg: "#E8923B",
    label: "Tiger",
    paths: `<circle cx="24" cy="26" r="12" fill="#E8923B"/>
      <ellipse cx="24" cy="30" rx="6" ry="4" fill="#FDEBD0"/>
      <circle cx="20" cy="24" r="1.5" fill="#2D2D2D"/>
      <circle cx="28" cy="24" r="1.5" fill="#2D2D2D"/>
      <ellipse cx="24" cy="28" rx="2" ry="1.2" fill="#2D2D2D"/>
      <path d="M22 31 Q24 33 26 31" stroke="#2D2D2D" strokeWidth="0.8" fill="none"/>
      <path d="M16 18 L20 22" stroke="#2D2D2D" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M18 16 L21 21" stroke="#2D2D2D" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M32 18 L28 22" stroke="#2D2D2D" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M30 16 L27 21" stroke="#2D2D2D" strokeWidth="1.5" strokeLinecap="round"/>
      <polygon points="16,14 18,22 12,20" fill="#E8923B"/>
      <polygon points="32,14 30,22 36,20" fill="#E8923B"/>`,
  },
}

interface AvatarIconProps {
  avatar: string
  size?: number
  className?: string
}

export function AvatarIcon({ avatar, size = 40, className }: AvatarIconProps) {
  const data = avatarData[avatar]
  if (!data) {
    return (
      <div
        className={className}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: "#555",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: size * 0.35,
          fontWeight: 700,
        }}
      >
        ?
      </div>
    )
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      aria-label={data.label}
    >
      <circle cx="24" cy="24" r="24" fill={data.bg} />
      <g dangerouslySetInnerHTML={{ __html: data.paths }} />
    </svg>
  )
}

export function getAvatarBg(avatar: string): string {
  return avatarData[avatar]?.bg || "#555"
}

export function getAvatarLabel(avatar: string): string {
  return avatarData[avatar]?.label || avatar
}

export { avatarData }
