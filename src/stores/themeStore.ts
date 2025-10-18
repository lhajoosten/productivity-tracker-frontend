import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark' | 'nature' | 'solarized'

interface ThemeState {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
}

const applyTheme = (theme: ThemeMode) => {
  if (typeof document === 'undefined') return

  const root = document.documentElement

  // Debug logging
  console.log('Applying theme:', theme)

  // Remove ALL possible theme classes
  root.classList.remove('light', 'dark', 'nature', 'solarized')

  // Add the selected theme class
  root.classList.add(theme)

  // Debug logging
  console.log('HTML classes after applying theme:', root.className)
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'light',

      setMode: (mode) => {
        console.log('setMode called with:', mode)
        applyTheme(mode)
        set({ mode })
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        console.log('Rehydrating theme store:', state)
        if (state?.mode) {
          applyTheme(state.mode)
        }
      },
    }
  )
)

// Initialize theme on module load
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  const initTheme = () => {
    const stored = localStorage.getItem('theme-storage')
    console.log('Stored theme data:', stored)

    if (stored) {
      try {
        const { state } = JSON.parse(stored)
        console.log('Parsed theme state:', state)
        if (state?.mode) {
          applyTheme(state.mode)
        } else {
          applyTheme('light')
        }
      } catch (e) {
        console.error('Error parsing theme:', e)
        applyTheme('light')
      }
    } else {
      console.log('No stored theme, using light')
      applyTheme('light')
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme)
  } else {
    initTheme()
  }
}
