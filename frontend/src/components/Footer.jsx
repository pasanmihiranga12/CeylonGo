import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-24 bg-jungle-950 text-ivory-50">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sand-400 text-jungle-950">
                <Compass size={18} />
              </span>
              <span className="font-display text-xl">CeylonGo</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-ivory-50/70">
              A student project connecting travellers with Sri Lanka's destinations and verified local guides.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-ivory-50/90">Explore</h4>
            <ul className="mt-4 space-y-2 text-sm text-ivory-50/70">
              <li><Link to="/destinations" className="hover:text-ivory-50">Destinations</Link></li>
              <li><Link to="/guides" className="hover:text-ivory-50">Local guides</Link></li>
              <li><Link to="/itinerary" className="hover:text-ivory-50">Plan an itinerary</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-ivory-50/90">Account</h4>
            <ul className="mt-4 space-y-2 text-sm text-ivory-50/70">
              <li><Link to="/login" className="hover:text-ivory-50">Log in</Link></li>
              <li><Link to="/register" className="hover:text-ivory-50">Create an account</Link></li>
              <li><Link to="/bookings" className="hover:text-ivory-50">My bookings</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-ivory-50/90">About this project</h4>
            <p className="mt-4 text-sm text-ivory-50/70">
              Built for SE2030 — Software Engineering, SLIIT. A working prototype, not a commercial booking platform.
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-ivory-50/10 pt-6 text-xs text-ivory-50/50 md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} CeylonGo. Student project — not for commercial use.</span>
          <span>Payments shown in this app are simulated.</span>
        </div>
      </div>
    </footer>
  )
}
