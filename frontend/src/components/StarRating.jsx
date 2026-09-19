import { Star } from 'lucide-react'

export default function StarRating({ rating = 0, size = 16, showValue = true, reviewCount }) {
  const rounded = Math.round(rating || 0)
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            className={i <= rounded ? 'fill-sand-400 text-sand-400' : 'fill-transparent text-jungle-950/20'}
          />
        ))}
      </span>
      {showValue && (
        <span className="text-sm text-ink-700">
          {rating ? rating.toFixed(1) : 'New'}
          {typeof reviewCount === 'number' && ` (${reviewCount})`}
        </span>
      )}
    </span>
  )
}
