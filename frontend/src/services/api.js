import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

const api = axios.create({ baseURL })

// Attach the JWT (if we have one) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ceylongo_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Unwrap the backend's { success, message, data } envelope and normalise errors
// so calling code can just `await` and `try/catch` a plain message string.
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Something went wrong. Please try again.'

    if (error.response?.status === 401) {
      localStorage.removeItem('ceylongo_token')
      localStorage.removeItem('ceylongo_user')
    }

    return Promise.reject(new Error(message))
  },
)

export default api
