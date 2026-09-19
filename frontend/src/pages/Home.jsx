import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, CalendarCheck, ChevronDown, Compass, MapPin, Search, ShieldCheck, Star, Users } from 'lucide-react'
import destinationService from '../services/destinationService'
import guideService from '../services/guideService'
import GuideCard from '../components/GuideCard'
import SmartImage from '../components/SmartImage'
import LoadingSpinner from '../components/LoadingSpinner'
import { heroImagePath } from '../utils/images'

const TRUST_POINTS = [
  { icon: ShieldCheck, label: 'Verified local guides' },
  { icon: Star, label: 'Traveller-rated experiences' },
  { icon: MapPin, label: 'Every corner of the island' },
]

const FEATURES = [
  { icon: Compass, number: '01', title: 'Find your place', text: 'From misty mountains to golden beaches, discover places worth making time for.' },
  { icon: CalendarCheck, number: '02', title: 'Shape your journey', text: 'Build an itinerary around the destinations, experiences and pace you actually want.' },
  { icon: Users, number: '03', title: 'Meet someone local', text: 'Connect with guides who know the stories, shortcuts and hidden corners behind the map.' },
]

export default function Home() {
  const [destinations, setDestinations] = useState([])
  const [guides, setGuides] = useState([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [destRes, guideRes] = await Promise.all([
          destinationService.search({ size: 6, sortBy: 'averageRating', direction: 'desc' }),
          guideService.list({ size: 3 }),
        ])
        if (!cancelled) {
          setDestinations(destRes.content || [])
          setGuides(guideRes.content || [])
        }
      } catch {
        // Keep the page usable when the API is temporarily unavailable.
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    navigate(keyword ? `/destinations?keyword=${encodeURIComponent(keyword)}` : '/destinations')
  }

  return (
    <div className="overflow-hidden bg-ivory-50">
      {/* HERO — editorial, photographic, no glass */}
      <section className="relative min-h-[720px] overflow-hidden bg-jungle-950 md:min-h-[790px]">
        <SmartImage
          candidates={[heroImagePath()]}
          alt="Sri Lankan landscape"
          className="absolute inset-0 h-full w-full"
          imgClassName="h-full w-full animate-ken-burns object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-jungle-950/85 via-jungle-950/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-jungle-950/80 via-transparent to-jungle-950/20" />

        <div className="relative mx-auto flex min-h-[720px] max-w-7xl items-end px-6 pb-28 pt-20 md:min-h-[790px] md:pb-32">
          <div className="max-w-4xl text-ivory-50">
            <p className="delay-1 mb-3 flex animate-rise items-center gap-3 text-[11px] font-bold uppercase tracking-[0.24em] text-sand-300">
              <span className="h-px w-10 bg-sand-300" />
              Your Sri Lanka starts here
            </p>

            <h1 className="delay-1 animate-rise font-hero text-7xl italic leading-[0.76] tracking-[-0.045em] text-ivory-50 sm:text-8xl md:text-[8.25rem] lg:text-[9rem]">
              Go beyond
              <span className="block pl-6 text-sand-300 md:pl-12">the postcard.</span>
            </h1>

            <p className="delay-2 mt-3 max-w-lg animate-rise text-[15px] leading-6 text-ivory-50/80 md:text-base">
              Discover extraordinary places, build your own route and travel with people who call Sri Lanka home.
            </p>

            <form onSubmit={handleSearch} className="delay-3 mt-4 flex w-full max-w-2xl animate-rise flex-col gap-2 rounded-2xl bg-ivory-50 p-2 shadow-card sm:flex-row sm:items-center sm:rounded-full sm:pl-5">
              <Search size={19} className="ml-2 hidden shrink-0 text-ink-700/60 sm:block" />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Where do you want to go?"
                className="w-full bg-transparent px-4 py-3 text-sm text-ink-900 placeholder:text-ink-700/50 focus:outline-none sm:px-2 sm:py-2"
              />
              <button type="submit" className="btn-gold !rounded-xl !px-7 !py-3 sm:!rounded-full">Explore</button>
            </form>

            <div className="delay-4 mt-4 flex animate-rise flex-wrap gap-x-6 gap-y-2">
              {TRUST_POINTS.map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-2 text-xs font-medium text-ivory-50/75">
                  <Icon size={15} className="text-sand-300" /> {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-ivory-50 [clip-path:polygon(0_70%,18%_42%,40%_72%,63%_35%,82%_61%,100%_25%,100%_100%,0_100%)]" />
        <div className="absolute bottom-10 right-8 hidden items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-ivory-50/70 lg:flex">
          Scroll to explore <ChevronDown size={16} />
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-9 md:pb-24 md:pt-2">
        <div className="grid items-end gap-10 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-jungle-700">A different way to travel</p>
            <h2 className="mt-3 max-w-3xl font-hero text-5xl italic leading-[0.9] tracking-tight text-jungle-950 md:text-6xl">
              Sri Lanka is better when you experience it <em className="text-jungle-700">locally.</em>
            </h2>
          </div>
          <div className="lg:pb-2">
            <p className="text-base leading-7 text-ink-700 md:text-lg">
              CeylonGo brings destinations, itineraries and trusted local guides into one simple place — so the trip feels like yours.
            </p>
            <Link to="/destinations" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-jungle-900">
              Start discovering <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <div className="mt-12 grid border-y border-jungle-950/10 md:grid-cols-3">
          {FEATURES.map(({ icon: Icon, number, title, text }, index) => (
            <div key={title} className={`group py-7 md:px-8 md:py-8 ${index !== 0 ? 'border-t border-jungle-950/10 md:border-l md:border-t-0' : ''}`}>
              <div className="flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-jungle-950/15 text-jungle-700 transition group-hover:bg-jungle-700 group-hover:text-white">
                  <Icon size={19} />
                </span>
                <span className="font-hero text-3xl text-jungle-950/20">{number}</span>
              </div>
              <h3 className="mt-6 text-xl">{title}</h3>
              <p className="mt-3 max-w-sm text-sm leading-6 text-ink-700">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="bg-jungle-950 py-20 text-ivory-50 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-sand-300">Places worth the detour</p>
              <h2 className="mt-2 font-hero text-5xl italic leading-none text-ivory-50 md:text-6xl">Popular destinations</h2>
            </div>
            <Link to="/destinations" className="inline-flex items-center gap-2 text-sm font-semibold text-sand-300 hover:text-white">
              See all destinations <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? <div className="mt-10"><LoadingSpinner /></div> : destinations.length === 0 ? (
            <p className="mt-10 text-sm text-ivory-50/65">Destinations will appear here once the backend has data.</p>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {destinations.map((d) => (
                <Link
                  key={d.id}
                  to={`/destinations/${d.id}`}
                  className="group relative overflow-hidden rounded-[1.5rem] border border-ivory-50/25 bg-jungle-900/40 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:border-sand-300/70 hover:shadow-card"
                >
                  <div className="relative aspect-[1.22/1] overflow-hidden">
                    <SmartImage
                      candidates={[d.imageUrl, `/images/destinations/${d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}.jpg`]}
                      alt={d.name}
                      className="absolute inset-0 h-full w-full"
                      imgClassName="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-jungle-950/75 via-transparent to-transparent" />
                    {d.category && (
                      <span className="absolute left-4 top-4 rounded-full border border-ivory-50/30 bg-jungle-950/75 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-ivory-50">
                        {d.category.name}
                      </span>
                    )}
                  </div>
                  <div className="border-t border-ivory-50/15 bg-jungle-950 px-5 py-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-2xl leading-none text-ivory-50">{d.name}</h3>
                        {d.location && <p className="mt-2 flex items-center gap-1.5 text-xs text-ivory-50/60"><MapPin size={13} />{d.location}</p>}
                      </div>
                      <ArrowRight size={18} className="mt-1 shrink-0 text-sand-300 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-ivory-50/10 pt-3 text-xs text-ivory-50/65">
                      <span className="flex items-center gap-1.5"><Star size={13} className="fill-sand-300 text-sand-300" /> {Number(d.averageRating || 0).toFixed(1)} · {d.reviewCount || 0} reviews</span>
                      {d.entryFee !== null && d.entryFee !== undefined && <span className="font-semibold text-sand-300">{d.entryFee > 0 ? `$${d.entryFee}` : 'Free'}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* GUIDES */}
      <section className="relative bg-ivory-100 py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-jungle-700">The people behind the journey</p>
              <h2 className="mt-3 font-hero text-5xl italic leading-[.88] text-jungle-950 md:text-6xl">Know a place?<br /><em>Know a local.</em></h2>
            </div>
            <div className="flex items-end justify-between gap-6">
              <p className="max-w-lg text-sm leading-6 text-ink-700 md:text-base">Meet verified local guides who can turn a list of places into stories you'll remember.</p>
              <Link to="/guides" className="hidden shrink-0 items-center gap-2 text-sm font-bold text-jungle-900 md:inline-flex">Meet the guides <ArrowRight size={16} /></Link>
            </div>
          </div>

          {!loading && guides.length > 0 && (
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {guides.map((g) => <GuideCard key={g.id} guide={g} />)}
            </div>
          )}
          <Link to="/guides" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-jungle-900 md:hidden">Meet the guides <ArrowRight size={16} /></Link>
        </div>
      </section>

      {/* FINAL CTA — premium editorial closing section */}
      <section className="px-6 py-16 md:py-20">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-jungle-950/10 bg-jungle-700 px-7 py-16 text-center shadow-card md:px-16 md:py-20">
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-sand-300/50 to-transparent" />
          <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full border border-sand-300/20" />
          <div className="absolute -right-14 -top-14 h-52 w-52 rounded-full border border-sand-300/10" />
          <div className="absolute -bottom-36 -left-28 h-80 w-80 rounded-full border border-ivory-50/10" />

          <div className="relative mx-auto max-w-4xl">
            <div className="mx-auto mb-7 flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.28em] text-sand-300">
              <span className="h-px w-8 bg-sand-300/70" />
              The island is waiting
              <span className="h-px w-8 bg-sand-300/70" />
            </div>

            <h2 className="mx-auto max-w-4xl font-hero text-5xl italic leading-[.88] tracking-[-0.025em] text-ivory-50 md:text-7xl">
              Don't just visit Sri Lanka.
              <br />
              <em className="text-sand-300">feel it.</em>
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-ivory-50/75 md:text-base">
              Create your route, find your people and start planning the island on your terms.
            </p>

            <Link to="/register" className="btn-gold mt-8 !px-8 shadow-soft">
              Start your journey <ArrowRight size={16} />
            </Link>

            <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-ivory-50/40">
              Destinations · Local guides · Your own route
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
