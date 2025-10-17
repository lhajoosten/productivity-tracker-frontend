import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark' | 'solarized' | 'alt-light' | 'alt-dark' | 'auto'

interface ThemeState {
  mode: ThemeMode
  effectiveTheme: 'light' | 'dark' | 'solarized' | 'alt-light' | 'alt-dark'
  setMode: (mode: ThemeMode) => void
}

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const applyTheme = (theme: 'light' | 'dark' | 'solarized' | 'alt-light' | 'alt-dark') => {
  const root = document.documentElement
  root.classList.remove('light', 'dark', 'solarized', 'alt-light', 'alt-dark')
  root.classList.add(theme)
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'auto',
      effectiveTheme: getSystemTheme(),

      setMode: (mode) => {
        let effectiveTheme: 'light' | 'dark' | 'solarized' | 'alt-light' | 'alt-dark'

        if (mode === 'auto') {
          effectiveTheme = getSystemTheme()
        } else {
          effectiveTheme = mode
        }

        applyTheme(effectiveTheme)
        set({ mode, effectiveTheme })
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          const effectiveTheme = state.mode === 'auto' ? getSystemTheme() : state.effectiveTheme
          applyTheme(effectiveTheme)
          state.effectiveTheme = effectiveTheme
        }
      },
    }
  )
)

// Listen for system theme changes
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const store = useThemeStore.getState()
    if (store.mode === 'auto') {
      const newTheme = e.matches ? 'dark' : 'light'
      applyTheme(newTheme)
      useThemeStore.setState({ effectiveTheme: newTheme })
    }
  })
}
