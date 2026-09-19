export default function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-jungle-950/15 bg-white/60 px-6 py-16 text-center">
      <h3 className="text-xl">{title}</h3>
      {description && <p className="max-w-md text-sm text-ink-700">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
