import api from './api'

const messageService = {
  async send(payload) {
    const res = await api.post('/messages', payload)
    return res.data
  },
  async getConversations() {
    const res = await api.get('/messages/conversations')
    return res.data
  },
  async getConversationWith(otherUserId) {
    const res = await api.get(`/messages/${otherUserId}`)
    return res.data
  },
}

export default messageService
