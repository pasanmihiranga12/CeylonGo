import api from './api'

const notificationService = {
  async getMine() {
    const res = await api.get('/notifications')
    return res.data
  },
  async getUnreadCount() {
    const res = await api.get('/notifications/unread-count')
    return res.data
  },
  async markAsRead(id) {
    return api.patch(`/notifications/${id}/read`)
  },
}

export default notificationService
