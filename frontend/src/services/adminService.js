import api from './api'

const adminService = {
  async getStats() {
    const res = await api.get('/admin/stats')
    return res.data
  },
  async listUsers() {
    const res = await api.get('/admin/users')
    return res.data
  },
  async setUserActive(id, active) {
    const res = await api.patch(`/admin/users/${id}/active`, null, { params: { active } })
    return res.data
  },
  async listGuides() {
    const res = await api.get('/admin/guides')
    return res.data
  },
  async verifyGuide(id, verified) {
    const res = await api.patch(`/admin/guides/${id}/verify`, null, { params: { verified } })
    return res.data
  },
  async createDestination(payload) {
    const res = await api.post('/admin/destinations', payload)
    return res.data
  },
  async updateDestination(id, payload) {
    const res = await api.put(`/admin/destinations/${id}`, payload)
    return res.data
  },
  async deleteDestination(id) {
    return api.delete(`/admin/destinations/${id}`)
  },
  async getFlaggedReviews() {
    const res = await api.get('/admin/reviews/flagged')
    return res.data
  },
  async deleteReview(id) {
    return api.delete(`/admin/reviews/${id}`)
  },
}

export default adminService
