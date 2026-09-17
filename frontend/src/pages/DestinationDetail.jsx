import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Clock, Ticket, Plus, CalendarDays, Sparkles, Flag } from 'lucide-react'
import destinationService from '../services/destinationService'
import reviewService from '../services/reviewService'
import itineraryService from '../services/itineraryService'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import StarRating from '../components/StarRating'
import ErrorBanner from '../components/ErrorBanner'
import SmartImage from '../components/SmartImage'
import { destinationImagePath } from '../utils/images'
import { formatDate } from '../utils/format'

export default function DestinationDetail() {
  const { id } = useParams()
  const { isAuthenticated, user } = useAuth()
  const [destination, setDestination] = useState(null)
  const [reviews, setReviews] = useState([])
  const [itineraries, setItineraries] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [reviewError, setReviewError] = useState('')
  const [actionMessage, setActionMessage] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([destinationService.getById(id), reviewService.forDestination(id, { size: 10 })])
      .then(([destRes, reviewRes]) => {
        if (cancelled) return
        setDestination(destRes)
        setReviews(reviewRes.content || [])
      })
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [id])

  useEffect(() => {
    if (isAuthenticated && user?.role === 'TOURIST') {
      itineraryService.getMine().then(setItineraries).catch(() => {})
    }
  }, [isAuthenticated, user])

  async function handleReviewSubmit(e) {
    e.preventDefault()
    setReviewError('')
    try {
      const newReview = await reviewService.create({ destinationId: Number(id), rating: reviewForm.rating, comment: reviewForm.comment })
      setReviews([newReview, ...reviews])
      setReviewForm({ rating: 5, comment: '' })
    } catch (err) {
      setReviewError(err.message)
    }
  }

  async function handleAddToItinerary(itineraryId) {
    setActionMessage('')
    try {
      await itineraryService.addItem(itineraryId, { destinationId: Number(id) })
      setActionMessage('Added to your itinerary.')
    } catch (err) {
      setActionMessage(err.message)
    }
  }

  if (loading) return <LoadingSpinner />
  if (!destination) return <EmptyState title="Destination not found" />

  return (
    <div className="min-h-screen bg-ivory-50 pb-20">
      {/* Hero */}
      <section className="relative h-[68vh] min-h-[520px] overflow-hidden bg-jungle-950">
        <SmartImage
          candidates={[destination.imageUrl, destinationImagePath(destination.name)]}
          alt={destination.name}
          className="absolute inset-0 h-full w-full"
          imgClassName="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-jungle-950 via-jungle-950/25 to-jungle-950/10" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-jungle-950/55 to-transparent" />

        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-between px-6 pb-12 pt-8 text-white">
          <Link to="/destinations" className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-black/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/15">
            <ArrowLeft size={16} /> All destinations
          </Link>

          <div className="max-w-4xl">
            {destination.category && (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                <Sparkles size={13} /> {destination.category.name}
              </span>
            )}
            <h1 className="mt-4 text-5xl leading-[0.95] text-white md:text-7xl">{destination.name}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-white/80">
              {destination.location && <span className="flex items-center gap-1.5"><MapPin size={16} /> {destination.location}</span>}
              <span className="h-1 w-1 rounded-full bg-white/45" />
              <StarRating rating={destination.averageRating} reviewCount={destination.reviewCount} />
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto -mt-1 max-w-7xl px-6">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-8">
            {/* Overview */}
            <section className="rounded-[2rem] border border-jungle-950/7 bg-white p-7 shadow-soft md:p-9">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-jungle-700/10 text-jungle-700"><MapPin size={20} /></span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-jungle-700">Discover the place</p>
                  <h2 className="mt-1 text-2xl md:text-3xl">About this destination</h2>
                </div>
              </div>
              <p className="mt-7 whitespace-pre-line text-[15px] leading-8 text-ink-700">
                {destination.description || 'No description has been added for this destination yet.'}
              </p>
            </section>

            {/* Reviews */}
            <section className="rounded-[2rem] border border-jungle-950/7 bg-white p-7 shadow-soft md:p-9">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-jungle-700">Traveller stories</p>
                  <h2 className="mt-1 text-2xl md:text-3xl">Reviews</h2>
                </div>
                {reviews.length > 0 && <StarRating rating={destination.averageRating} reviewCount={reviews.length} />}
              </div>

              {isAuthenticated ? (
                <form onSubmit={handleReviewSubmit} className="mt-7 rounded-3xl bg-ivory-50 p-5 md:p-6">
                  <ErrorBanner message={reviewError} />
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-sm font-semibold">Your rating</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button type="button" key={n} onClick={() => setReviewForm({ ...reviewForm, rating: n })} className={`h-9 w-9 rounded-full text-sm font-bold transition ${n <= reviewForm.rating ? 'bg-sand-400 text-jungle-950' : 'bg-white text-ink-700 hover:bg-jungle-700/10'}`}>
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} placeholder="Share what your visit was like…" rows={3} className="input mt-4 bg-white" />
                  <button type="submit" className="btn-primary mt-3">Post review</button>
                </form>
              ) : (
                <p className="mt-6 rounded-2xl bg-ivory-50 p-5 text-sm text-ink-700">
                  <Link to="/login" className="font-semibold text-jungle-900">Log in</Link> to leave a review.
                </p>
              )}

              <div className="mt-7 divide-y divide-jungle-950/7">
                {reviews.length === 0 ? <p className="py-4 text-sm text-ink-700">No reviews yet — be the first to share your experience.</p> : reviews.map((r) => (
                  <article key={r.id} className="py-6 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="font-semibold text-jungle-950">{r.reviewerName}</span>
                        <div className="mt-1"><StarRating rating={r.rating} showValue={false} size={14} /></div>
                      </div>
                      <span className="text-xs text-ink-700/55">{formatDate(r.createdAt)}</span>
                    </div>
                    {r.comment && <p className="mt-3 text-sm leading-7 text-ink-700">{r.comment}</p>}
                    <button onClick={() => reviewService.flag(r.id)} className="mt-3 text-xs text-ink-700/45 hover:text-red-500">Report this review</button>
                  </article>
                ))}
              </div>
            </section>
          </div>

          {/* Info / actions */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-[2rem] border border-jungle-950/10 bg-white shadow-card">
              <div className="bg-jungle-950 p-7 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-sand-300">Plan your visit</p>
                <h2 className="mt-2 text-2xl text-white">Good to know</h2>
              </div>
              <div className="space-y-5 p-7">
                <div className="flex gap-4"><Clock size={19} className="mt-0.5 shrink-0 text-jungle-700" /><div><p className="text-xs font-semibold uppercase tracking-wider text-ink-700/50">Opening hours</p><p className="mt-1 text-sm font-semibold">{destination.openingHours || 'Hours not listed'}</p></div></div>
                <div className="flex gap-4"><Ticket size={19} className="mt-0.5 shrink-0 text-jungle-700" /><div><p className="text-xs font-semibold uppercase tracking-wider text-ink-700/50">Entry fee</p><p className="mt-1 text-sm font-semibold">{destination.entryFee ? `$${destination.entryFee}` : 'Free entry'}</p></div></div>
                {destination.latitude && destination.longitude && <a href={`https://www.google.com/maps?q=${destination.latitude},${destination.longitude}`} target="_blank" rel="noreferrer" className="btn-secondary w-full">View on map</a>}
              </div>
            </div>

            {user?.role === 'TOURIST' && (
              <div className="rounded-[2rem] border border-jungle-950/7 bg-white p-7 shadow-soft">
                <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sand-400/25 text-jungle-900"><CalendarDays size={19} /></span><h3 className="text-xl">Add to itinerary</h3></div>
                {itineraries.length === 0 ? (
                  <p className="mt-4 text-sm leading-6 text-ink-700">You don't have an itinerary yet. <Link to="/itinerary" className="font-semibold text-jungle-900">Create one</Link>.</p>
                ) : (
                  <div className="mt-5 space-y-2">{itineraries.map((it) => <button key={it.id} onClick={() => handleAddToItinerary(it.id)} className="flex w-full items-center justify-between rounded-2xl border border-jungle-950/10 px-4 py-3 text-sm font-semibold transition hover:border-jungle-700/40 hover:bg-ivory-50">{it.title}<Plus size={15} /></button>)}</div>
                )}
                {actionMessage && <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-jungle-700"><Flag size={13} /> {actionMessage}</p>}
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  )
}
