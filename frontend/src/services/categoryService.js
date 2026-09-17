import api from './api'

const categoryService = {
  async listAll() {
    const res = await api.get('/categories')
    return res.data
  },
}

export default categoryService
