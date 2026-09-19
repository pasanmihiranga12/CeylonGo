import { useEffect, useState } from 'react'
import { Plus, Trash2, MapPin, GripVertical, ArrowUp, ArrowDown, X } from 'lucide-react'
import itineraryService from '../services/itineraryService'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import ErrorBanner from '../components/ErrorBanner'
import { formatDate } from '../utils/format'

export default function Itinerary() {
  const [itineraries, setItineraries] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [error, setError] = useState('')

  const selected = itineraries.find((i) => i.id === selectedId)

  useEffect(() => {
    loadAll()
  }, [])

  function loadAll(preserveSelection = true) {
    setLoading(true)
    itineraryService
      .getMine()
      .then((data) => {
        setItineraries(data)
        if (!preserveSelection || !data.find((i) => i.id === selectedId)) {
          setSelectedId(data[0]?.id ?? null)
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  async function handleCreate(e) {
    e.preventDefault()
    try {
      const created = await itineraryService.create({ title: newTitle })
      setNewTitle('')
      setCreating(false)
      setItineraries((prev) => [created, ...prev])
      setSelectedId(created.id)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDeleteItinerary(id) {
    await itineraryService.remove(id)
    loadAll(false)
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl">My itineraries</h1>
          <p className="mt-3 max-w-lg text-ink-700">Build a day-by-day plan and add destinations or guides to each day.</p>
        </div>
        <button onClick={() => setCreating(true)} className="btn-primary">
          <Plus size={16} /> New itinerary
        </button>
      </div>

      <ErrorBanner message={error} />

      {creating && (
        <form onSubmit={handleCreate} className="mt-6 flex max-w-md items-center gap-2 rounded-2xl bg-white p-2 shadow-soft">
          <input
            autoFocus
            required
            placeholder="e.g. South Coast — 4 Days"
            className="input !border-0 !shadow-none"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button type="submit" className="btn-primary shrink-0 !px-4 !py-2 text-xs">Create</button>
          <button type="button" onClick={() => setCreating(false)} className="shrink-0 p-2 text-ink-700/50 hover:text-ink-900">
            <X size={16} />
          </button>
        </form>
      )}

      {itineraries.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No itineraries yet"
            description="Create your first itinerary, then add destinations to it from any destination page."
            action={<button onClick={() => setCreating(true)} className="btn-primary">Create an itinerary</button>}
          />
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="space-y-2 lg:col-span-1">
            {itineraries.map((it) => (
              <button
                key={it.id}
                onClick={() => setSelectedId(it.id)}
                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left text-sm transition-colors ${
                  it.id === selectedId
                    ? 'border-jungle-700 bg-jungle-700/5 font-semibold text-jungle-900'
                    : 'border-jungle-950/10 bg-white text-ink-700 hover:border-jungle-700/30'
                }`}
              >
                <span>
                  {it.title}
                  <span className="ml-2 text-xs font-normal text-ink-700/50">{it.items.length} stops</span>
                </span>
                <Trash2
                  size={14}
                  className="shrink-0 text-ink-700/30 hover:text-red-500"
                  onClick={(e) => { e.stopPropagation(); handleDeleteItinerary(it.id) }}
                />
              </button>
            ))}
          </div>

          <div className="lg:col-span-2">
            {selected && <ItineraryBoard itinerary={selected} onChange={(updated) => {
              setItineraries((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
            }} />}
          </div>
        </div>
      )}
    </div>
  )
}

function ItineraryBoard({ itinerary, onChange }) {
  const days = groupByDay(itinerary.items)

  async function moveItem(itemId, direction) {
    const ids = itinerary.items.map((i) => i.id)
    const index = ids.indexOf(itemId)
    const swapWith = direction === 'up' ? index - 1 : index + 1
    if (swapWith < 0 || swapWith >= ids.length) return
    ;[ids[index], ids[swapWith]] = [ids[swapWith], ids[index]]
    const updated = await itineraryService.reorder(itinerary.id, ids)
    onChange(updated)
  }

  async function removeItem(itemId) {
    const updated = await itineraryService.removeItem(itinerary.id, itemId)
    onChange(updated)
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">{itinerary.title}</h2>
        {itinerary.startDate && (
          <span className="text-sm text-ink-700">{formatDate(itinerary.startDate)} – {formatDate(itinerary.endDate)}</span>
        )}
      </div>

      {itinerary.items.length === 0 ? (
        <p className="mt-6 text-sm text-ink-700">
          No stops yet. Visit a destination page and use "Add to itinerary" to start building your plan.
        </p>
      ) : (
        <div className="mt-6 space-y-8">
          {Object.entries(days).map(([day, items]) => (
            <div key={day}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-jungle-700/70">
                {day === 'unassigned' ? 'Unscheduled' : `Day ${day}`}
              </h3>
              <div className="mt-3 space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-jungle-950/10 bg-ivory-50 px-4 py-3">
                    <GripVertical size={16} className="shrink-0 text-ink-700/30" />
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-1.5 truncate text-sm font-semibold">
                        <MapPin size={13} className="shrink-0 text-jungle-700" />
                        {item.destinationName || item.activity || 'Untitled stop'}
                      </p>
                      {item.guideName && <p className="text-xs text-ink-700/60">Guide: {item.guideName}</p>}
                    </div>
                    <button onClick={() => moveItem(item.id, 'up')} className="p-1 text-ink-700/40 hover:text-jungle-900">
                      <ArrowUp size={14} />
                    </button>
                    <button onClick={() => moveItem(item.id, 'down')} className="p-1 text-ink-700/40 hover:text-jungle-900">
                      <ArrowDown size={14} />
                    </button>
                    <button onClick={() => removeItem(item.id)} className="p-1 text-ink-700/40 hover:text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function groupByDay(items) {
  return items.reduce((acc, item) => {
    const key = item.dayNumber ?? 'unassigned'
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})
}
