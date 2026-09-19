import { createContext, useContext, useEffect, useState } from 'react'
import authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('ceylongo_user')
    return stored ? JSON.parse(stored) : null
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      localStorage.setItem('ceylongo_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('ceylongo_user')
    }
  }, [user])

  async function login(credentials) {
    setLoading(true)
    try {
      const data = await authService.login(credentials)
      localStorage.setItem('ceylongo_token', data.token)
      setUser(data.user)
      return data.user
    } finally {
      setLoading(false)
    }
  }

  async function register(payload) {
    setLoading(true)
    try {
      const data = await authService.register(payload)
      localStorage.setItem('ceylongo_token', data.token)
      setUser(data.user)
      return data.user
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    await authService.logout()
    setUser(null)
  }

  function updateLocalUser(patch) {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev))
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateLocalUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
