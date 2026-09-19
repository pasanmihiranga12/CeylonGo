import api from './api'

const reviewService = {
  async create(payload) {
    const res = await api.post('/reviews', payload)
    return res.data
  },
  async forDestination(destinationId, params = {}) {
    const res = await api.get(`/reviews/destination/${destinationId}`, { params })
    return res.data
  },
  async forGuide(guideId, params = {}) {
    const res = await api.get(`/reviews/guide/${guideId}`, { params })
    return res.data
  },
  async getMine(params = {}) {
    const res = await api.get('/reviews/mine', { params })
    return res.data
  },
  async flag(id) {
    const res = await api.post(`/reviews/${id}/flag`)
    return res.data
  },
}

export default reviewService
