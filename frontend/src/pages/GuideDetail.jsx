import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  DollarSign,
  Languages,
  MapPin,
  MessageCircle,
  Send,
  Sparkles,
  UserRound,
} from 'lucide-react'
import guideService from '../services/guideService'
import reviewService from '../services/reviewService'
import bookingService from '../services/bookingService'
import messageService from '../services/messageService'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import StarRating from '../components/StarRating'
import ErrorBanner from '../components/ErrorBanner'
import { initials, formatDate } from '../utils/format'
import { guideImagePath, heroImagePath } from '../utils/images'

function GuideImage({ src, name, className = '', type = 'profile' }) {
  const candidates = type === 'cover'
    ? [src, heroImagePath()]
    : [src, guideImagePath(name)]
  const [index, setIndex] = useState(0)
  const currentSrc = candidates.filter(Boolean)[index]

  if (!currentSrc) {
    return (
      <div className={`flex h-full w-full items-center justify-center bg-jungle-700/10 text-4xl font-semibold text-jungle-900 ${className}`}>
        {initials(name)}
      </div>
    )
  }

  return (
    <img
      src={currentSrc}
      alt={name}
      onError={() => setIndex((value) => value + 1)}
      className={`h-full w-full object-cover ${className}`}
    />
  )
}

export default function GuideDetail() {
  const { id } = useParams()
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  const [guide, setGuide] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [bookingForm, setBookingForm] = useState({ bookingDate: '', bookingTime: '', notes: '' })
  const [bookingError, setBookingError] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [messageStatus, setMessageStatus] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([guideService.getById(id), reviewService.forGuide(id, { size: 10 })])
      .then(([guideRes, reviewRes]) => {
        if (cancelled) return
        setGuide(guideRes)
        setReviews(reviewRes.content || [])
      })
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [id])

  async function handleBooking(e) {
    e.preventDefault()
    setBookingError('')
    try {
      await bookingService.create({ guideId: Number(id), ...bookingForm })
      setBookingSuccess(true)
      setBookingForm({ bookingDate: '', bookingTime: '', notes: '' })
    } catch (err) {
      setBookingError(err.message)
    }
  }

  async function handleSendMessage(e) {
    e.preventDefault()
    setMessageStatus('')
    try {
      await messageService.send({ receiverId: guide.userId, content: messageText })
      setMessageText('')
      setMessageStatus('Message sent successfully.')
    } catch (err) {
      setMessageStatus(err.message)
    }
  }

  if (loading) return <LoadingSpinner />
  if (!guide) return <EmptyState title="Guide not found" />

  const languages = (guide.languages || '').split(',').map((l) => l.trim()).filter(Boolean)
  const specialities = (guide.specialities || '').split(',').map((s) => s.trim()).filter(Boolean)
  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0

  return (
    <div className="min-h-screen bg-ivory-50 pb-20">
      {/* Cover */}
      <div className="relative h-[280px] overflow-hidden bg-jungle-950 md:h-[340px]">
        <GuideImage
          src={guide.coverImageUrl || guide.coverUrl || ''}
          name={guide.name}
          type="cover"
          className="absolute inset-0 object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-jungle-950/30 via-jungle-950/20 to-jungle-950/85" />
        <div className="relative mx-auto flex h-full max-w-7xl items-start px-6 pt-7">
          <Link
            to="/guides"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/15"
          >
            <ArrowLeft size={16} />
            All guides
          </Link>
        </div>
      </div>

      <main className="mx-auto -mt-20 max-w-7xl px-6 relative z-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* Main profile */}
          <section>
            <div className="rounded-[2rem] border border-jungle-950/5 bg-white p-6 shadow-card md:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
                <div className="relative -mt-20 shrink-0">
                  <div className="h-36 w-36 overflow-hidden rounded-[2rem] border-[6px] border-white bg-ivory-100 shadow-card md:h-40 md:w-40">
                    <GuideImage src={guide.profileImageUrl} name={guide.name} type="profile" />
                  </div>
                  {guide.verified && (
                    <span className="absolute -bottom-2 -right-2 flex items-center gap-1 rounded-full border-4 border-white bg-jungle-700 px-3 py-1.5 text-xs font-bold text-white shadow-soft">
                      <BadgeCheck size={14} /> Verified
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1 pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-3xl leading-tight md:text-4xl">{guide.name}</h1>
                  </div>
                  <p className="mt-2 flex items-center gap-2 text-sm text-ink-700">
                    <MapPin size={16} className="text-jungle-700" />
                    Local guide in Sri Lanka
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <StarRating rating={averageRating} reviewCount={reviews.length} />
                    {guide.experienceYears && (
                      <span className="text-sm text-ink-700">{guide.experienceYears} years experience</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <ProfileStat icon={Languages} label="Languages" value={languages.join(', ') || 'Not specified'} />
                <ProfileStat icon={Clock3} label="Experience" value={guide.experienceYears ? `${guide.experienceYears} years` : 'Not specified'} />
                <ProfileStat icon={DollarSign} label="Hourly rate" value={guide.hourlyRate ? `$${guide.hourlyRate} / hour` : 'Not specified'} />
              </div>
            </div>

            <div className="mt-8 grid gap-8">
              {guide.bio && (
                <section className="rounded-[2rem] border border-jungle-950/5 bg-white p-7 shadow-soft md:p-8">
                  <SectionHeading icon={UserRound} eyebrow="Get to know your guide" title="About" />
                  <p className="mt-5 max-w-3xl text-[15px] leading-8 text-ink-700">{guide.bio}</p>
                </section>
              )}

              {specialities.length > 0 && (
                <section className="rounded-[2rem] border border-jungle-950/5 bg-white p-7 shadow-soft md:p-8">
                  <SectionHeading icon={Sparkles} eyebrow="What I can help with" title="Specialities" />
                  <div className="mt-5 flex flex-wrap gap-2.5">
                    {specialities.map((speciality) => (
                      <span
                        key={speciality}
                        className="rounded-full border border-jungle-700/15 bg-ivory-50 px-4 py-2 text-sm font-semibold text-jungle-900"
                      >
                        {speciality}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              <section className="rounded-[2rem] border border-jungle-950/5 bg-white p-7 shadow-soft md:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <SectionHeading icon={MessageCircle} eyebrow="Traveller experiences" title="Reviews" />
                  {reviews.length > 0 && (
                    <div className="rounded-2xl bg-ivory-50 px-4 py-3">
                      <StarRating rating={averageRating} reviewCount={reviews.length} />
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-0">
                  {reviews.length === 0 ? (
                    <div className="rounded-2xl bg-ivory-50 p-6 text-center">
                      <p className="font-semibold text-jungle-900">No reviews yet</p>
                      <p className="mt-1 text-sm text-ink-700">Be the first traveller to share your experience.</p>
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <article key={review.id} className="border-b border-jungle-950/5 py-6 first:pt-0 last:border-0 last:pb-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold text-jungle-950">{review.reviewerName}</p>
                            <div className="mt-1">
                              <StarRating rating={review.rating} showValue={false} size={14} />
                            </div>
                          </div>
                          <span className="shrink-0 text-xs text-ink-700/60">{formatDate(review.createdAt)}</span>
                        </div>
                        {review.comment && <p className="mt-3 text-sm leading-7 text-ink-700">{review.comment}</p>}
                      </article>
                    ))
                  )}
                </div>
              </section>
            </div>
          </section>

          {/* Booking / contact */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-[2rem] border border-jungle-950/10 bg-white shadow-card">
              <div className="bg-jungle-950 p-7 text-white">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-sand-300">Plan your experience</p>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <div>
                    <h2 className="font-display text-2xl text-white">Book {guide.name.split(' ')[0]}</h2>
                    <p className="mt-1 text-sm text-white/65">Send a request and arrange the details.</p>
                  </div>
                  {guide.hourlyRate && (
                    <div className="text-right">
                      <p className="text-2xl font-bold">${guide.hourlyRate}</p>
                      <p className="text-xs text-white/60">per hour</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-7">
                {!isAuthenticated ? (
                  <div>
                    <p className="text-sm leading-6 text-ink-700">Log in as a traveller to request a booking with this guide.</p>
                    <Link to="/login" className="btn-primary mt-5 w-full">Log in to book</Link>
                  </div>
                ) : user.role !== 'TOURIST' ? (
                  <div className="rounded-2xl bg-ivory-50 p-5">
                    <p className="text-sm leading-6 text-ink-700">Only traveller accounts can request bookings.</p>
                  </div>
                ) : bookingSuccess ? (
                  <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-jungle-700/10 text-jungle-700">
                      <CheckCircle2 size={28} />
                    </div>
                    <h3 className="mt-4 text-xl">Request sent</h3>
                    <p className="mt-2 text-sm leading-6 text-ink-700">Your booking request is with the guide. You can track it from your bookings.</p>
                    <button onClick={() => navigate('/bookings')} className="btn-secondary mt-5 w-full">View my bookings</button>
                  </div>
                ) : (
                  <form onSubmit={handleBooking} className="space-y-4">
                    <ErrorBanner message={bookingError} />
                    <div>
                      <label className="label" htmlFor="bookingDate">Preferred date</label>
                      <div className="relative">
                        <CalendarDays size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-jungle-700" />
                        <input
                          id="bookingDate"
                          type="date"
                          required
                          className="input pl-11"
                          value={bookingForm.bookingDate}
                          onChange={(e) => setBookingForm({ ...bookingForm, bookingDate: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="label" htmlFor="bookingTime">Preferred time</label>
                      <div className="relative">
                        <Clock3 size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-jungle-700" />
                        <input
                          id="bookingTime"
                          type="time"
                          required
                          className="input pl-11"
                          value={bookingForm.bookingTime}
                          onChange={(e) => setBookingForm({ ...bookingForm, bookingTime: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="label" htmlFor="notes">Anything to tell the guide?</label>
                      <textarea
                        id="notes"
                        rows={4}
                        className="input resize-none"
                        placeholder="Tell them what you'd like to see or ask before the trip..."
                        value={bookingForm.notes}
                        onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                      />
                    </div>
                    <button type="submit" className="btn-primary w-full py-3.5">Request booking</button>
                    <p className="text-center text-xs leading-5 text-ink-700/60">Payment is handled separately. Your request is sent to the guide for confirmation.</p>
                  </form>
                )}
              </div>
            </div>

            {isAuthenticated && user.role === 'TOURIST' && (
              <div className="mt-5 rounded-[2rem] border border-jungle-950/10 bg-white p-6 shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-jungle-700/10 text-jungle-700">
                    <MessageCircle size={19} />
                  </div>
                  <div>
                    <h3 className="text-base">Have a question?</h3>
                    <p className="text-xs text-ink-700/65">Message the guide before booking.</p>
                  </div>
                </div>
                <form onSubmit={handleSendMessage} className="mt-4 space-y-3">
                  <textarea
                    rows={3}
                    required
                    className="input resize-none"
                    placeholder="Ask about availability, places, languages..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  <button type="submit" className="btn-secondary w-full">
                    <Send size={16} />
                    Send message
                  </button>
                  {messageStatus && <p className="text-xs text-jungle-700">{messageStatus}</p>}
                </form>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  )
}

function ProfileStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-jungle-950/5 bg-ivory-50 p-4">
      <Icon size={18} className="text-jungle-700" />
      <p className="mt-3 text-xs font-medium uppercase tracking-wide text-ink-700/55">{label}</p>
      <p className="mt-1 text-sm font-bold leading-5 text-jungle-950">{value}</p>
    </div>
  )
}

function SectionHeading({ icon: Icon, eyebrow, title }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-jungle-700">
        <Icon size={15} />
        {eyebrow}
      </div>
      <h2 className="mt-2 text-2xl md:text-3xl">{title}</h2>
    </div>
  )
}
