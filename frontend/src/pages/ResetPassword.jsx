import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import authService from '../services/authService'
import ErrorBanner from '../components/ErrorBanner'

export default function ResetPassword() {
  const location = useLocation()
  const navigate = useNavigate()
  const [token, setToken] = useState(location.state?.token || '')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authService.resetPassword(token, newPassword)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-md flex-col justify-center px-6 py-16">
      <h1 className="text-3xl">Set a new password</h1>
      <p className="mt-2 text-sm text-ink-700">Paste your reset token and choose a new password.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <ErrorBanner message={error} />
        {success && (
          <div className="rounded-2xl border border-jungle-700/20 bg-jungle-700/5 px-4 py-3 text-sm text-jungle-900">
            Password reset. Redirecting to log in…
          </div>
        )}
        <div>
          <label className="label" htmlFor="token">Reset token</label>
          <input id="token" required className="input" value={token} onChange={(e) => setToken(e.target.value)} />
        </div>
        <div>
          <label className="label" htmlFor="newPassword">New password</label>
          <input
            id="newPassword"
            type="password"
            required
            minLength={6}
            className="input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Resetting…' : 'Reset password'}
        </button>
      </form>
    </div>
  )
}
