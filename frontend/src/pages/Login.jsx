import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ErrorBanner from '../components/ErrorBanner'
import SmartImage from '../components/SmartImage'
import { authImagePath } from '../utils/images'

export default function Login() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await login(form)
      const redirectTo = location.state?.from?.pathname || '/'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-73px)] md:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl">Welcome back</h1>
          <p className="mt-2 text-sm text-ink-700">Log in to plan your trip and manage your bookings.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <ErrorBanner message={error} />
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                className="input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="label" htmlFor="password">Password</label>
                <Link to="/forgot-password" className="text-xs font-medium text-jungle-700 hover:text-jungle-900">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                required
                className="input"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Logging in…' : 'Log in'}
            </button>
          </form>

          <p className="mt-6 text-sm text-ink-700">
            New to CeylonGo?{' '}
            <Link to="/register" className="font-semibold text-jungle-900 hover:text-jungle-700">
              Create an account
            </Link>
          </p>
        </div>
      </div>
      <div className="relative hidden md:block">
        <SmartImage
          candidates={[authImagePath('login')]}
          alt=""
          className="absolute inset-0 h-full w-full"
          imgClassName="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-jungle-950/20" />
      </div>
    </div>
  )
}