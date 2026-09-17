import { useState } from 'react'
import { Link } from 'react-router-dom'
import authService from '../services/authService'
import ErrorBanner from '../components/ErrorBanner'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await authService.forgotPassword(email)
      // No email service is wired up in this student project, so the token
      // is shown directly here for demo purposes.
      setToken(data.resetToken)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-md flex-col justify-center px-6 py-16">
      <h1 className="text-3xl">Reset your password</h1>
      <p className="mt-2 text-sm text-ink-700">Enter your email and we'll generate a reset token.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <ErrorBanner message={error} />
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Sending…' : 'Send reset token'}
        </button>
      </form>

      {token && (
        <div className="mt-6 rounded-2xl border border-jungle-700/20 bg-jungle-700/5 p-4 text-sm">
          <p className="text-ink-700">
            No email service is connected in this project, so here's your reset token directly:
          </p>
          <code className="mt-2 block break-all rounded-xl bg-white px-3 py-2 text-xs text-jungle-900">{token}</code>
          <Link to="/reset-password" state={{ token }} className="mt-3 inline-block text-sm font-semibold text-jungle-900 hover:text-jungle-700">
            Continue to reset password →
          </Link>
        </div>
      )}
    </div>
  )
}
