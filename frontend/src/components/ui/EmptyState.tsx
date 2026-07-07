interface EmptyStateProps {
  icon:    string
  title:   string
  message: string
  action?: { label: string; onClick: () => void }
}

export default function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4 opacity-60">{icon}</div>
      <h3 className="font-display text-xl font-semibold text-ocean mb-2">{title}</h3>
      <p className="font-body text-sm text-[var(--text-muted)] max-w-xs mb-5">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-5 py-2.5 bg-ocean text-white font-display text-sm rounded-lg hover:bg-ocean-dark transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}