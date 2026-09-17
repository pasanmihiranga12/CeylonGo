import api from './api'

const itineraryService = {
  async getMine() {
    const res = await api.get('/itineraries')
    return res.data
  },
  async getById(id) {
    const res = await api.get(`/itineraries/${id}`)
    return res.data
  },
  async create(payload) {
    const res = await api.post('/itineraries', payload)
    return res.data
  },
  async update(id, payload) {
    const res = await api.put(`/itineraries/${id}`, payload)
    return res.data
  },
  async remove(id) {
    return api.delete(`/itineraries/${id}`)
  },
  async addItem(itineraryId, payload) {
    const res = await api.post(`/itineraries/${itineraryId}/items`, payload)
    return res.data
  },
  async updateItem(itineraryId, itemId, payload) {
    const res = await api.put(`/itineraries/${itineraryId}/items/${itemId}`, payload)
    return res.data
  },
  async removeItem(itineraryId, itemId) {
    const res = await api.delete(`/itineraries/${itineraryId}/items/${itemId}`)
    return res.data
  },
  async reorder(itineraryId, itemIdsInOrder) {
    const res = await api.put(`/itineraries/${itineraryId}/reorder`, { itemIdsInOrder })
    return res.data
  },
}

export default itineraryService
