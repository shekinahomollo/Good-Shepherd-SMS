interface TopbarProps {
  pageTitle: string
}

export default function Topbar({ pageTitle }: TopbarProps) {
  return (
    <header className="h-16 bg-white border-b border-ocean/10 flex items-center justify-between px-8 sticky top-0 z-40">
      <h1 className="font-display text-xl font-semibold text-ocean">
        {pageTitle}
      </h1>

      <div className="flex items-center gap-3">
        {/* Term badge */}
        <div className="px-4 py-1.5 bg-gold/15 border border-gold/40 rounded-full font-display text-xs text-[#7a5f00] font-medium">
          📅 Term 2 — 2024/25
        </div>

        {/* Notification bell */}
        <button className="w-10 h-10 rounded-full border border-ocean/15 bg-white flex items-center justify-center text-base hover:border-ocean transition-colors relative">
          🔔
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal rounded-full border-2 border-white" />
        </button>
      </div>
    </header>
  )
}