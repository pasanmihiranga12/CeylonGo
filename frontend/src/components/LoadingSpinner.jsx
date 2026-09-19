export default function LoadingSpinner({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-700">
      <span className="h-9 w-9 animate-spin rounded-full border-2 border-jungle-700/20 border-t-jungle-700" />
      <p className="text-sm">{label}</p>
    </div>
  )
}
