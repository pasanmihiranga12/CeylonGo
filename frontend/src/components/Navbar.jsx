import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Compass, Menu, X, User, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { initials } from '../utils/format'

const PUBLIC_LINKS = [
  { to: '/destinations', label: 'Destinations' },
  { to: '/guides', label: 'Guides' },
]

const TOURIST_LINKS = [
  { to: '/itinerary', label: 'Itinerary' },
  { to: '/bookings', label: 'Bookings' },
  { to: '/messages', label: 'Messages' },
]

const GUIDE_LINKS = [
  { to: '/bookings', label: 'Bookings' },
  { to: '/messages', label: 'Messages' },
]

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  // Keep the navigation solid from the first paint so links are always readable.
  const transparent = false

  const roleLinks = user?.role === 'TOURIST' ? TOURIST_LINKS : user?.role === 'GUIDE' ? GUIDE_LINKS : []

  async function handleLogout() {
    await logout()
    setOpen(false)
    navigate('/')
  }

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      transparent
        ? isActive ? 'text-ivory-50' : 'text-ivory-50/70 hover:text-ivory-50'
        : isActive ? 'text-jungle-900' : 'text-ink-700 hover:text-jungle-900'
    }`

  return (
    <header
      className="fixed inset-x-0 top-0 z-40 w-full border-b border-jungle-950/8 bg-ivory-50"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2">
          <span className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${transparent ? 'bg-ivory-50 text-jungle-950' : 'bg-jungle-700 text-ivory-50'}`}>
            <Compass size={18} />
          </span>
          <span className={`font-display text-xl transition-colors ${transparent ? 'text-ivory-50' : 'text-jungle-950'}`}>CeylonGo</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {PUBLIC_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
          {roleLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
          {user?.role === 'ADMIN' && (
            <NavLink to="/admin" className={linkClass}>
              Admin
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  transparent ? 'bg-ivory-50/15 text-ivory-50' : 'bg-jungle-700/10 text-jungle-900'
                }`}
                title={user.name}
              >
                {initials(user.name)}
              </Link>
              <button
                onClick={handleLogout}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                  transparent
                    ? 'border-ivory-50/40 text-ivory-50 hover:bg-ivory-50 hover:text-jungle-950'
                    : 'border-jungle-700 text-jungle-900 hover:bg-jungle-700 hover:text-ivory-50'
                }`}
              >
                <LogOut size={14} /> Log out
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className={`text-sm font-medium ${transparent ? 'text-ivory-50/80 hover:text-ivory-50' : 'text-ink-700 hover:text-jungle-900'}`}>
                Log in
              </Link>
              <Link
                to="/register"
                className={transparent ? 'btn-gold !px-5 !py-2.5 text-xs' : 'btn-primary !px-5 !py-2.5 text-xs'}
              >
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          className={transparent ? 'text-ivory-50 md:hidden' : 'text-ink-900 md:hidden'}
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-jungle-950/5 bg-ivory-50 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {[...PUBLIC_LINKS, ...roleLinks, ...(user?.role === 'ADMIN' ? [{ to: '/admin', label: 'Admin' }] : [])].map(
              (link) => (
                <NavLink key={link.to} to={link.to} className="text-sm font-medium text-ink-700" onClick={() => setOpen(false)}>
                  {link.label}
                </NavLink>
              ),
            )}
            <hr className="border-jungle-950/10" />
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="flex items-center gap-2 text-sm font-medium text-ink-700" onClick={() => setOpen(false)}>
                  <User size={16} /> {user.name}
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-ink-700">
                  <LogOut size={16} /> Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-ink-700" onClick={() => setOpen(false)}>
                  Log in
                </Link>
                <Link to="/register" className="btn-primary w-fit !px-5 !py-2.5 text-xs" onClick={() => setOpen(false)}>
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}