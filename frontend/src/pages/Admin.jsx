import { useEffect, useState } from 'react'
import { Users, MapPin, BadgeCheck, Flag, LayoutDashboard, Plus, Trash2 } from 'lucide-react'
import adminService from '../services/adminService'
import categoryService from '../services/categoryService'
import destinationService from '../services/destinationService'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import ErrorBanner from '../components/ErrorBanner'
import StarRating from '../components/StarRating'
import { formatDate } from '../utils/format'

const TABS = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'users', label: 'Users', icon: Users },
  { key: 'guides', label: 'Guides', icon: BadgeCheck },
  { key: 'destinations', label: 'Destinations', icon: MapPin },
  { key: 'reviews', label: 'Flagged reviews', icon: Flag },
]

export default function Admin() {
  const [tab, setTab] = useState('overview')

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <h1 className="text-4xl">Admin dashboard</h1>
      <p className="mt-3 text-ink-700">Manage platform content, verify guides, and moderate reviews.</p>

      <div className="mt-8 flex flex-wrap gap-2 border-b border-jungle-950/10">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              tab === key ? 'border-jungle-700 text-jungle-900' : 'border-transparent text-ink-700 hover:text-jungle-900'
            }`}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === 'overview' && <OverviewTab />}
        {tab === 'users' && <UsersTab />}
        {tab === 'guides' && <GuidesTab />}
        {tab === 'destinations' && <DestinationsTab />}
        {tab === 'reviews' && <ReviewsTab />}
      </div>
    </div>
  )
}

function OverviewTab() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    adminService.getStats().then(setStats)
  }, [])

  if (!stats) return <LoadingSpinner />

  const cards = [
    { label: 'Total users', value: stats.totalUsers },
    { label: 'Tourists', value: stats.totalTourists },
    { label: 'Guides', value: `${stats.verifiedGuides} / ${stats.totalGuides} verified` },
    { label: 'Destinations', value: stats.totalDestinations },
    { label: 'Bookings', value: stats.totalBookings },
    { label: 'Pending bookings', value: stats.pendingBookings },
    { label: 'Confirmed bookings', value: stats.confirmedBookings },
    { label: 'Reviews', value: stats.totalReviews },
    { label: 'Flagged reviews', value: stats.flaggedReviews },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((c) => (
        <div key={c.label} className="card p-5">
          <p className="text-sm text-ink-700">{c.label}</p>
          <p className="mt-1 text-2xl font-semibold text-jungle-950">{c.value}</p>
        </div>
      ))}
    </div>
  )
}

function UsersTab() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  function load() {
    setLoading(true)
    adminService.listUsers().then(setUsers).finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function toggleActive(user) {
    await adminService.setUserActive(user.id, !user.active)
    load()
  }

  if (loading) return <LoadingSpinner />
  if (users.length === 0) return <EmptyState title="No users found" />

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-soft">
      <table className="w-full text-left text-sm">
        <thead className="bg-ivory-100 text-xs uppercase tracking-wide text-ink-700/60">
          <tr>
            <th className="px-5 py-3 font-medium">Name</th>
            <th className="px-5 py-3 font-medium">Email</th>
            <th className="px-5 py-3 font-medium">Role</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t border-jungle-950/5">
              <td className="px-5 py-3 font-medium">{u.name}</td>
              <td className="px-5 py-3 text-ink-700">{u.email}</td>
              <td className="px-5 py-3 text-ink-700">{u.role}</td>
              <td className="px-5 py-3">
                <span className={u.active !== false ? 'text-jungle-700' : 'text-red-500'}>
                  {u.active !== false ? 'Active' : 'Deactivated'}
                </span>
              </td>
              <td className="px-5 py-3 text-right">
                <button onClick={() => toggleActive(u)} className="text-xs font-semibold text-jungle-900 hover:text-jungle-700">
                  {u.active !== false ? 'Deactivate' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function GuidesTab() {
  const [guides, setGuides] = useState([])
  const [loading, setLoading] = useState(true)

  function load() {
    setLoading(true)
    adminService.listGuides().then(setGuides).finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function toggleVerified(guide) {
    await adminService.verifyGuide(guide.id, !guide.verified)
    load()
  }

  if (loading) return <LoadingSpinner />
  if (guides.length === 0) return <EmptyState title="No guides found" />

  return (
    <div className="space-y-3">
      {guides.map((g) => (
        <div key={g.id} className="card flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <p className="flex items-center gap-1.5 font-semibold">
              {g.name}
              {g.verified && <BadgeCheck size={16} className="text-jungle-700" />}
            </p>
            <p className="text-sm text-ink-700">{g.email} · {g.languages || 'No languages listed'}</p>
          </div>
          <button
            onClick={() => toggleVerified(g)}
            className={g.verified ? 'btn-secondary !px-4 !py-2 text-xs' : 'btn-primary !px-4 !py-2 text-xs'}
          >
            {g.verified ? 'Remove verification' : 'Verify guide'}
          </button>
        </div>
      ))}
    </div>
  )
}

function DestinationsTab() {
  const [destinations, setDestinations] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', description: '', categoryId: '', location: '', entryFee: '', openingHours: '', imageUrl: '' })

  function load() {
    setLoading(true)
    destinationService.search({ size: 100 }).then((res) => setDestinations(res.content || [])).finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    categoryService.listAll().then(setCategories)
  }, [])

  async function handleCreate(e) {
    e.preventDefault()
    setError('')
    try {
      await adminService.createDestination({
        ...form,
        categoryId: form.categoryId ? Number(form.categoryId) : null,
        entryFee: form.entryFee ? Number(form.entryFee) : null,
      })
      setCreating(false)
      setForm({ name: '', description: '', categoryId: '', location: '', entryFee: '', openingHours: '', imageUrl: '' })
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id) {
    await adminService.deleteDestination(id)
    load()
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="flex justify-end">
        <button onClick={() => setCreating((c) => !c)} className="btn-primary !px-4 !py-2 text-xs">
          <Plus size={14} /> Add destination
        </button>
      </div>

      {creating && (
        <form onSubmit={handleCreate} className="card mt-4 grid gap-4 p-6 sm:grid-cols-2">
          <ErrorBanner message={error} />
          <div className="sm:col-span-2">
            <label className="label">Name</label>
            <input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Description</label>
            <textarea rows={3} className="input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="label">Category</label>
            <select className="input" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
              <option value="">None</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Location</label>
            <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div>
            <label className="label">Entry fee (USD)</label>
            <input type="number" min="0" step="0.01" className="input" value={form.entryFee} onChange={(e) => setForm({ ...form, entryFee: e.target.value })} />
          </div>
          <div>
            <label className="label">Opening hours</label>
            <input className="input" value={form.openingHours} onChange={(e) => setForm({ ...form, openingHours: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Image URL</label>
            <input className="input" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-primary">Create destination</button>
          </div>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {destinations.map((d) => (
          <div key={d.id} className="card flex items-center justify-between gap-3 p-5">
            <div>
              <p className="font-semibold">{d.name}</p>
              <p className="text-sm text-ink-700">{d.location} · {d.category?.name || 'Uncategorised'}</p>
            </div>
            <button onClick={() => handleDelete(d.id)} className="p-2 text-ink-700/40 hover:text-red-500">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReviewsTab() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  function load() {
    setLoading(true)
    adminService.getFlaggedReviews().then((res) => setReviews(res.content || [])).finally(() => setLoading(false))
  }

  useEffect(load, [])

  async function handleDelete(id) {
    await adminService.deleteReview(id)
    load()
  }

  if (loading) return <LoadingSpinner />
  if (reviews.length === 0) return <EmptyState title="No flagged reviews" description="Reviews reported by users will show up here for moderation." />

  return (
    <div className="space-y-3">
      {reviews.map((r) => (
        <div key={r.id} className="card p-5">
          <div className="flex items-center justify-between">
            <p className="font-semibold">{r.reviewerName}</p>
            <span className="text-xs text-ink-700/60">{formatDate(r.createdAt)}</span>
          </div>
          <div className="mt-1"><StarRating rating={r.rating} showValue={false} size={14} /></div>
          {r.comment && <p className="mt-2 text-sm text-ink-700">{r.comment}</p>}
          <button onClick={() => handleDelete(r.id)} className="btn-secondary mt-3 !px-4 !py-2 text-xs">
            Delete review
          </button>
        </div>
      ))}
    </div>
  )
}
