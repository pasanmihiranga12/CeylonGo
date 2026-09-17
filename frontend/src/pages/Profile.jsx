import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import authService from '../services/authService'
import guideService from '../services/guideService'
import ErrorBanner from '../components/ErrorBanner'
import { initials } from '../utils/format'

export default function Profile() {
  const { user, updateLocalUser } = useAuth()
  const [form, setForm] = useState({ name: user.name, phone: user.phone || '', profileImageUrl: user.profileImageUrl || '' })
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const [guideProfile, setGuideProfile] = useState(null)
  const [guideForm, setGuideForm] = useState({ bio: '', languages: '', specialities: '', experienceYears: '', hourlyRate: '' })
  const [guideSaved, setGuideSaved] = useState(false)
  const [guideError, setGuideError] = useState('')

  useEffect(() => {
    if (user.role === 'GUIDE') {
      guideService
        .getMyProfile()
        .then((profile) => {
          setGuideProfile(profile)
          setGuideForm({
            bio: profile.bio || '',
            languages: profile.languages || '',
            specialities: profile.specialities || '',
            experienceYears: profile.experienceYears || '',
            hourlyRate: profile.hourlyRate || '',
          })
        })
        .catch(() => {}) // no profile created yet — form starts empty
    }
  }, [user.role])

  async function handleProfileSubmit(e) {
    e.preventDefault()
    setError('')
    setSaved(false)
    try {
      const updated = await authService.updateProfile(form)
      updateLocalUser(updated)
      setSaved(true)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleGuideSubmit(e) {
    e.preventDefault()
    setGuideError('')
    setGuideSaved(false)
    try {
      const payload = {
        ...guideForm,
        experienceYears: guideForm.experienceYears ? Number(guideForm.experienceYears) : null,
        hourlyRate: guideForm.hourlyRate ? Number(guideForm.hourlyRate) : null,
      }
      const updated = await guideService.updateMyProfile(payload)
      setGuideProfile(updated)
      setGuideSaved(true)
    } catch (err) {
      setGuideError(err.message)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <div className="flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-jungle-700/10 text-xl font-semibold text-jungle-900">
          {initials(user.name)}
        </span>
        <div>
          <h1 className="text-3xl">{user.name}</h1>
          <p className="text-sm text-ink-700">{user.email} · {user.role.charAt(0) + user.role.slice(1).toLowerCase()}</p>
        </div>
      </div>

      <section className="card mt-10 p-6">
        <h2 className="text-xl">Profile details</h2>
        <form onSubmit={handleProfileSubmit} className="mt-5 space-y-4">
          <ErrorBanner message={error} />
          {saved && <p className="text-sm text-jungle-700">Profile updated.</p>}
          <div>
            <label className="label" htmlFor="name">Full name</label>
            <input id="name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label" htmlFor="phone">Phone</label>
            <input id="phone" className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="label" htmlFor="profileImageUrl">Profile image URL</label>
            <input id="profileImageUrl" className="input" value={form.profileImageUrl} onChange={(e) => setForm({ ...form, profileImageUrl: e.target.value })} />
          </div>
          <button type="submit" className="btn-primary">Save changes</button>
        </form>
      </section>

      {user.role === 'GUIDE' && (
        <section className="card mt-8 p-6">
          <h2 className="text-xl">Guide profile</h2>
          <p className="mt-1 text-sm text-ink-700">
            This is what tourists see on your guide listing.
            {guideProfile && !guideProfile.verified && ' Your account is awaiting admin verification.'}
          </p>
          <form onSubmit={handleGuideSubmit} className="mt-5 space-y-4">
            <ErrorBanner message={guideError} />
            {guideSaved && <p className="text-sm text-jungle-700">Guide profile saved.</p>}
            <div>
              <label className="label" htmlFor="bio">Bio</label>
              <textarea id="bio" rows={4} className="input" value={guideForm.bio} onChange={(e) => setGuideForm({ ...guideForm, bio: e.target.value })} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="languages">Languages (comma-separated)</label>
                <input id="languages" className="input" value={guideForm.languages} onChange={(e) => setGuideForm({ ...guideForm, languages: e.target.value })} />
              </div>
              <div>
                <label className="label" htmlFor="specialities">Specialities (comma-separated)</label>
                <input id="specialities" className="input" value={guideForm.specialities} onChange={(e) => setGuideForm({ ...guideForm, specialities: e.target.value })} />
              </div>
              <div>
                <label className="label" htmlFor="experienceYears">Years of experience</label>
                <input id="experienceYears" type="number" min="0" className="input" value={guideForm.experienceYears} onChange={(e) => setGuideForm({ ...guideForm, experienceYears: e.target.value })} />
              </div>
              <div>
                <label className="label" htmlFor="hourlyRate">Hourly rate (USD)</label>
                <input id="hourlyRate" type="number" min="0" step="0.01" className="input" value={guideForm.hourlyRate} onChange={(e) => setGuideForm({ ...guideForm, hourlyRate: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn-primary">Save guide profile</button>
          </form>
        </section>
      )}
    </div>
  )
}
