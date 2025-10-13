import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types/api'
import { setTokens } from '@/lib/api'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: User | null
  isAuthenticated: boolean
  login: (accessToken: string, refreshToken: string, user: User) => void
  logout: () => void
  setUser: (user: User) => void
  updateTokens: (accessToken: string, refreshToken: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      login: (accessToken, refreshToken, user) => {
        setTokens(accessToken, refreshToken)
        set({
          accessToken,
          refreshToken,
          user,
          isAuthenticated: true,
        })
      },

      logout: () => {
        setTokens(null, null)
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        })
      },

      setUser: (user) => {
        set({ user })
      },

      updateTokens: (accessToken, refreshToken) => {
        setTokens(accessToken, refreshToken)
        set({ accessToken, refreshToken })
      },
    }),
    {
      name: 'auth-storage',
      // Only persist tokens and user info
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      // Rehydrate tokens to API client on load
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken && state?.refreshToken) {
          setTokens(state.accessToken, state.refreshToken)
        }
      },
    }
  )
)
