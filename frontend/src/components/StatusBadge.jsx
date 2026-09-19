const STYLES = {
  PENDING: 'bg-sand-400/20 text-sand-400 border border-sand-400/40',
  CONFIRMED: 'bg-jungle-700/10 text-jungle-700 border border-jungle-700/30',
  CANCELLED: 'bg-red-50 text-red-600 border border-red-200',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${STYLES[status] || 'bg-ink-900/5 text-ink-700'}`}>
      {status?.charAt(0) + status?.slice(1).toLowerCase()}
    </span>
  )
}
