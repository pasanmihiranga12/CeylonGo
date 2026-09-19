import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal } from 'lucide-react'
import destinationService from '../services/destinationService'
import categoryService from '../services/categoryService'
import DestinationCard from '../components/DestinationCard'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'

const SORT_OPTIONS = [
  { value: 'averageRating,desc', label: 'Top rated' },
  { value: 'name,asc', label: 'Name (A–Z)' },
  { value: 'entryFee,asc', label: 'Entry fee (low to high)' },
]

export default function Destinations() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [destinations, setDestinations] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const keyword = searchParams.get('keyword') || ''
  const categoryId = searchParams.get('categoryId') || ''
  const sort = searchParams.get('sort') || 'averageRating,desc'

  useEffect(() => {
    categoryService.listAll().then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    const [sortBy, direction] = sort.split(',')

    destinationService
      .search({ keyword: keyword || undefined, categoryId: categoryId || undefined, sortBy, direction, size: 24 })
      .then((res) => {
        if (!cancelled) setDestinations(res.content || [])
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [keyword, categoryId, sort])

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <div className="max-w-2xl">
        <h1 className="text-4xl">Destinations</h1>
        <p className="mt-3 text-ink-700">
          Browse beaches, heritage sites, wildlife parks and hill country escapes across Sri Lanka.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 rounded-3xl bg-white p-4 shadow-soft md:flex-row md:items-center">
        <div className="flex flex-1 items-center gap-2 rounded-2xl border border-jungle-950/10 px-4 py-2.5">
          <Search size={16} className="text-ink-700/50" />
          <input
            value={keyword}
            onChange={(e) => updateParam('keyword', e.target.value)}
            placeholder="Search by name or location…"
            className="w-full bg-transparent text-sm focus:outline-none"
          />
        </div>

        <select
          value={categoryId}
          onChange={(e) => updateParam('categoryId', e.target.value)}
          className="rounded-2xl border border-jungle-950/10 bg-white px-4 py-2.5 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <div className="flex items-center gap-2 rounded-2xl border border-jungle-950/10 px-4 py-2.5">
          <SlidersHorizontal size={14} className="text-ink-700/50" />
          <select
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="bg-transparent text-sm focus:outline-none"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-10">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <EmptyState title="Couldn't load destinations" description={error} />
        ) : destinations.length === 0 ? (
          <EmptyState
            title="No destinations match your search"
            description="Try a different keyword or clear the category filter."
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((d) => (
              <DestinationCard key={d.id} destination={d} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
