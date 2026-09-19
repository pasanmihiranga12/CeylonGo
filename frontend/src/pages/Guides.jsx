import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import guideService from '../services/guideService'
import GuideCard from '../components/GuideCard'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'

export default function Guides() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [guides, setGuides] = useState([])
  const [loading, setLoading] = useState(true)
  const language = searchParams.get('language') || ''

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    guideService
      .list({ language: language || undefined, size: 24 })
      .then((res) => !cancelled && setGuides(res.content || []))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [language])

  return (
    <div className="mx-auto max-w-7xl px-6 py-14">
      <div className="max-w-2xl">
        <h1 className="text-4xl">Local guides</h1>
        <p className="mt-3 text-ink-700">
          Verified guides ready to show you their part of Sri Lanka — filter by the language you'd like to speak.
        </p>
      </div>

      <div className="mt-8 flex max-w-sm items-center gap-2 rounded-2xl border border-jungle-950/10 bg-white px-4 py-2.5 shadow-soft">
        <Search size={16} className="text-ink-700/50" />
        <input
          value={language}
          onChange={(e) => {
            const next = new URLSearchParams(searchParams)
            if (e.target.value) next.set('language', e.target.value)
            else next.delete('language')
            setSearchParams(next)
          }}
          placeholder="Filter by language, e.g. German"
          className="w-full bg-transparent text-sm focus:outline-none"
        />
      </div>

      <div className="mt-10">
        {loading ? (
          <LoadingSpinner />
        ) : guides.length === 0 ? (
          <EmptyState title="No guides found" description="Try clearing the language filter." />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {guides.map((g) => (
              <GuideCard key={g.id} guide={g} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
