import api from './api'

const authService = {
  async register(payload) {
    const res = await api.post('/auth/register', payload)
    return res.data
  },
  async login(payload) {
    const res = await api.post('/auth/login', payload)
    return res.data
  },
  async logout() {
    try {
      await api.post('/auth/logout')
    } finally {
      localStorage.removeItem('ceylongo_token')
      localStorage.removeItem('ceylongo_user')
    }
  },
  async forgotPassword(email) {
    const res = await api.post('/auth/forgot-password', { email })
    return res.data
  },
  async resetPassword(token, newPassword) {
    const res = await api.post('/auth/reset-password', { token, newPassword })
    return res.data
  },
  async getMyProfile() {
    const res = await api.get('/users/me')
    return res.data
  },
  async updateProfile(payload) {
    const res = await api.put('/users/me', payload)
    return res.data
  },
}

export default authService
