import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ErrorBanner from '../components/ErrorBanner'
import SmartImage from '../components/SmartImage'
import { authImagePath } from '../utils/images'

export default function Register() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'TOURIST' })
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await register(form)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-73px)] md:grid-cols-2">
      <div className="relative hidden md:block">
        <SmartImage
          candidates={[authImagePath('register')]}
          alt=""
          className="absolute inset-0 h-full w-full"
          imgClassName="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-jungle-950/20" />
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl">Create your account</h1>
          <p className="mt-2 text-sm text-ink-700">Join as a traveller, or as a guide to offer your services.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <ErrorBanner message={error} />

            <div>
              <label className="label" htmlFor="name">Full name</label>
              <input id="name" required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input id="email" type="email" required className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="phone">Phone (optional)</label>
              <input id="phone" className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <label className="label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                className="input"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div>
              <span className="label">I am joining as a…</span>
              <div className="grid grid-cols-2 gap-3">
                {['TOURIST', 'GUIDE'].map((role) => (
                  <button
                    type="button"
                    key={role}
                    onClick={() => setForm({ ...form, role })}
                    className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors ${
                      form.role === role
                        ? 'border-jungle-700 bg-jungle-700/10 text-jungle-900'
                        : 'border-jungle-950/10 text-ink-700 hover:border-jungle-700/40'
                    }`}
                  >
                    {role === 'TOURIST' ? 'Traveller' : 'Local guide'}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-sm text-ink-700">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-jungle-900 hover:text-jungle-700">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}