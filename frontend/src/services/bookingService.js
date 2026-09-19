import api from './api'

const bookingService = {
  async create(payload) {
    const res = await api.post('/bookings', payload)
    return res.data
  },
  async getMine() {
    const res = await api.get('/bookings/mine')
    return res.data
  },
  async getReceived() {
    const res = await api.get('/bookings/received')
    return res.data
  },
  async getById(id) {
    const res = await api.get(`/bookings/${id}`)
    return res.data
  },
  async updateStatus(id, status) {
    const res = await api.patch(`/bookings/${id}/status`, { status })
    return res.data
  },
  async simulatePayment(id) {
    const res = await api.post(`/bookings/${id}/pay`)
    return res.data
  },
}

export default bookingService
