import api from './api'

const destinationService = {
  async search(params = {}) {
    const res = await api.get('/destinations', { params })
    return res.data
  },
  async getById(id) {
    const res = await api.get(`/destinations/${id}`)
    return res.data
  },
  async create(payload) {
    const res = await api.post('/destinations', payload)
    return res.data
  },
  async update(id, payload) {
    const res = await api.put(`/destinations/${id}`, payload)
    return res.data
  },
  async remove(id) {
    return api.delete(`/destinations/${id}`)
  },
}

export default destinationService
