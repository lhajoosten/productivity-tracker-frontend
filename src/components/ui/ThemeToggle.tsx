import { useThemeStore, type ThemeMode } from '@/stores/themeStore'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { mode, setMode } = useThemeStore()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.theme-toggle')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const themes: { value: ThemeMode; label: string; icon: string; description: string }[] = [
    { value: 'light', label: 'Light', icon: '☀️', description: 'Clean & bright' },
    { value: 'dark', label: 'Dark', icon: '🌙', description: 'Easy on eyes' },
    { value: 'solarized', label: 'Solarized', icon: '🌆', description: 'Warm tones' },
    { value: 'alt-light', label: 'Nature', icon: '🌿', description: 'Emerald green' },
    { value: 'alt-dark', label: 'Tech', icon: '💜', description: 'Purple vibes' },
    { value: 'auto', label: 'Auto', icon: '🔄', description: 'Match system' },
  ]

  const currentTheme = themes.find((t) => t.value === mode) || themes[0]

  return (
    <div className="relative theme-toggle">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg
                   bg-light-secondary-100 dark:bg-dark-secondary-800 solarized:bg-solarized-secondary-200 alt-light:bg-alt-light-secondary-200 alt-dark:bg-alt-dark-secondary-800
                   text-light-secondary-900 dark:text-dark-secondary-100 solarized:text-solarized-secondary-900 alt-light:text-alt-light-secondary-900 alt-dark:text-alt-dark-secondary-100
                   hover:bg-light-secondary-200 dark:hover:bg-dark-secondary-700 solarized:hover:bg-solarized-secondary-300 alt-light:hover:bg-alt-light-secondary-300 alt-dark:hover:bg-alt-dark-secondary-700
                   border border-light-secondary-200 dark:border-dark-secondary-700 solarized:border-solarized-secondary-400 alt-light:border-alt-light-secondary-300 alt-dark:border-alt-dark-secondary-700
                   shadow-sm transition-all duration-200 hover:shadow-md"
        aria-label="Toggle theme"
      >
        <span className="text-lg">{currentTheme.icon}</span>
        <span className="hidden sm:inline">{currentTheme.label}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg shadow-elevation-3
                        bg-white dark:bg-dark-secondary-800 solarized:bg-solarized-secondary-100 alt-light:bg-alt-light-secondary-50 alt-dark:bg-alt-dark-secondary-900
                        border border-light-secondary-200 dark:border-dark-secondary-700 solarized:border-solarized-secondary-300 alt-light:border-alt-light-secondary-200 alt-dark:border-alt-dark-secondary-800
                        ring-1 ring-black ring-opacity-5 z-50
                        animate-scale-in">
          <div className="py-1">
            {themes.map((theme) => (
              <button
                key={theme.value}
                onClick={() => {
                  setMode(theme.value)
                  setIsOpen(false)
                }}
                className={`w-full flex items-start gap-3 px-4 py-3 text-sm
                           transition-colors duration-150
                           ${
                             mode === theme.value
                               ? 'bg-light-primary-50 dark:bg-dark-primary-900/20 solarized:bg-solarized-primary-100 alt-light:bg-alt-light-primary-50 alt-dark:bg-alt-dark-primary-900/20 text-light-primary-700 dark:text-dark-primary-400 solarized:text-solarized-primary-700 alt-light:text-alt-light-primary-700 alt-dark:text-alt-dark-primary-400'
                               : 'text-light-secondary-700 dark:text-dark-secondary-300 solarized:text-solarized-secondary-800 alt-light:text-alt-light-secondary-700 alt-dark:text-alt-dark-secondary-300 hover:bg-light-secondary-50 dark:hover:bg-dark-secondary-700 solarized:hover:bg-solarized-secondary-200 alt-light:hover:bg-alt-light-secondary-100 alt-dark:hover:bg-alt-dark-secondary-800'
                           }`}
              >
                <span className="text-xl flex-shrink-0">{theme.icon}</span>
                <div className="flex-1 text-left">
                  <div className="font-medium">{theme.label}</div>
                  <div className={`text-xs mt-0.5 ${mode === theme.value ? 'opacity-90' : 'opacity-60'}`}>
                    {theme.description}
                  </div>
                </div>
                {mode === theme.value && (
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
