import { useEffect, useState } from 'react'
import { CalendarDays, Clock, CreditCard } from 'lucide-react'
import bookingService from '../services/bookingService'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import StatusBadge from '../components/StatusBadge'
import { formatDate, formatTime } from '../utils/format'

export default function Bookings() {
  const { user } = useAuth()
  const isGuide = user?.role === 'GUIDE'
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [isGuide])

  function load() {
    setLoading(true)
    const fetcher = isGuide ? bookingService.getReceived() : bookingService.getMine()
    fetcher.then(setBookings).finally(() => setLoading(false))
  }

  async function updateStatus(id, status) {
    await bookingService.updateStatus(id, status)
    load()
  }

  async function pay(id) {
    await bookingService.simulatePayment(id)
    load()
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="text-4xl">{isGuide ? 'Booking requests' : 'My bookings'}</h1>
      <p className="mt-3 text-ink-700">
        {isGuide
          ? 'Requests tourists have sent you. Confirm or decline each one.'
          : 'Track the status of guides you have requested.'}
      </p>

      {bookings.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title={isGuide ? 'No booking requests yet' : 'No bookings yet'}
            description={isGuide ? 'Requests will show up here once a tourist books you.' : 'Browse guides and request a booking to get started.'}
          />
        </div>
      ) : (
        <div className="mt-10 space-y-4">
          {bookings.map((b) => (
            <div key={b.id} className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold">{isGuide ? b.touristName : b.guideName}</p>
                  <StatusBadge status={b.status} />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-ink-700">
                  <span className="flex items-center gap-1.5"><CalendarDays size={14} /> {formatDate(b.bookingDate)}</span>
                  <span className="flex items-center gap-1.5"><Clock size={14} /> {formatTime(b.bookingTime)}</span>
                  {b.simulatedAmount && (
                    <span className="flex items-center gap-1.5">
                      <CreditCard size={14} /> ${b.simulatedAmount} {b.paymentSimulated ? '(paid)' : '(unpaid)'}
                    </span>
                  )}
                </div>
                {b.notes && <p className="mt-2 text-sm text-ink-700/80">{b.notes}</p>}
              </div>

              <div className="flex shrink-0 flex-wrap gap-2">
                {isGuide && b.status === 'PENDING' && (
                  <>
                    <button onClick={() => updateStatus(b.id, 'CONFIRMED')} className="btn-primary !px-4 !py-2 text-xs">Accept</button>
                    <button onClick={() => updateStatus(b.id, 'CANCELLED')} className="btn-secondary !px-4 !py-2 text-xs">Decline</button>
                  </>
                )}
                {!isGuide && b.status === 'PENDING' && (
                  <button onClick={() => updateStatus(b.id, 'CANCELLED')} className="btn-secondary !px-4 !py-2 text-xs">Cancel</button>
                )}
                {!isGuide && b.status === 'CONFIRMED' && !b.paymentSimulated && (
                  <button onClick={() => pay(b.id)} className="btn-gold !px-4 !py-2 text-xs">Simulate payment</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
