import api from './api'

const guideService = {
  async list(params = {}) {
    const res = await api.get('/guides', { params })
    return res.data
  },
  async getById(id) {
    const res = await api.get(`/guides/${id}`)
    return res.data
  },
  async getMyProfile() {
    const res = await api.get('/guides/me')
    return res.data
  },
  async updateMyProfile(payload) {
    const res = await api.put('/guides/me', payload)
    return res.data
  },
}

export default guideService
