import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios       from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

interface AuthUser {
  id:        string
  email:     string
  role:      'ADMIN' | 'TEACHER' | 'PARENT'
  firstName: string
  lastName:  string
  avatarUrl?: string
}

interface AuthState {
  user:        AuthUser | null
  accessToken: string   | null
  login:       (email: string, password: string) => Promise<void>
  logout:      () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user:        null,
      accessToken: null,

      login: async (email, password) => {
        const { data } = await axios.post(
          `${BASE}/auth/login`,
          { email, password },
          { withCredentials: true }
        )
        set({ user: data.user, accessToken: data.accessToken })
      },

      logout: () => {
        set({ user: null, accessToken: null })
        localStorage.removeItem('gs-sms-auth')
      },
    }),
    { name: 'gs-sms-auth' }
  )
)