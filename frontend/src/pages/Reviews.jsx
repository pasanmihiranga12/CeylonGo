import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import reviewService from '../services/reviewService'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import StarRating from '../components/StarRating'
import { formatDate } from '../utils/format'

export default function Reviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    reviewService.getMine({ size: 50 }).then((res) => setReviews(res.content || [])).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <h1 className="text-4xl">My reviews</h1>
      <p className="mt-3 text-ink-700">Reviews you've left for destinations and guides.</p>

      {reviews.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="You haven't written any reviews yet"
            description="Visit a destination or guide page after your trip to share your experience."
            action={<Link to="/destinations" className="btn-primary">Browse destinations</Link>}
          />
        </div>
      ) : (
        <div className="mt-10 space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="card p-5">
              <div className="flex items-center justify-between">
                <Link
                  to={r.destinationId ? `/destinations/${r.destinationId}` : `/guides/${r.guideId}`}
                  className="font-semibold text-jungle-900 hover:text-jungle-700"
                >
                  {r.destinationName || r.guideName}
                </Link>
                <span className="text-xs text-ink-700/60">{formatDate(r.createdAt)}</span>
              </div>
              <div className="mt-1"><StarRating rating={r.rating} showValue={false} size={14} /></div>
              {r.comment && <p className="mt-2 text-sm text-ink-700">{r.comment}</p>}
              {r.flagged && <p className="mt-2 text-xs text-sand-400">Flagged for moderation</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
