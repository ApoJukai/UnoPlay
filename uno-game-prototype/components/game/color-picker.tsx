"use client"

const colors = [
  { value: "red", bg: "#D72600", label: "Red" },
  { value: "blue", bg: "#0956BF", label: "Blue" },
  { value: "green", bg: "#379711", label: "Green" },
  { value: "yellow", bg: "#ECD407", label: "Yellow", textDark: true },
]

interface ColorPickerProps {
  onSelect: (color: string) => void
  onCancel: () => void
}

export function ColorPicker({ onSelect, onCancel }: ColorPickerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div
        className="rounded-2xl p-8 shadow-2xl max-w-xs w-full mx-4 border border-white/10"
        style={{ background: "linear-gradient(145deg, #1e293b, #0f172a)" }}
      >
        <h3 className="text-center font-bold text-xl mb-2" style={{ color: "#fff" }}>
          Choose a Color
        </h3>
        <p className="text-center text-sm mb-6" style={{ color: "#94a3b8" }}>
          Pick the color for your wild card
        </p>
        <div className="grid grid-cols-2 gap-4">
          {colors.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => onSelect(c.value)}
              className="rounded-xl h-20 flex flex-col items-center justify-center font-bold transition-all hover:scale-110 active:scale-95 cursor-pointer border-2 border-transparent hover:border-white/40"
              style={{
                background: c.bg,
                color: c.textDark ? "#1A1A1A" : "#fff",
                boxShadow: `0 4px 20px ${c.bg}66`,
              }}
            >
              <span className="text-lg">{c.label}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="mt-5 w-full py-2 rounded-lg text-sm transition-colors cursor-pointer hover:bg-white/10"
          style={{ color: "#94a3b8" }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
