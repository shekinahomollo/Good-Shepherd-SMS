import axios from 'axios'

export const api = axios.create({
  baseURL:         import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  withCredentials: true,
})

// Attach token to every request
api.interceptors.request.use((config) => {
  const raw   = localStorage.getItem('gs-sms-auth')
  const store = raw ? JSON.parse(raw) : null
  const token = store?.state?.accessToken

  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// On 401 try to refresh once
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401 && !err.config._retry) {
      err.config._retry = true
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        )
        err.config.headers.Authorization = `Bearer ${data.accessToken}`
        return api(err.config)
      } catch {
        localStorage.removeItem('gs-sms-auth')
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)