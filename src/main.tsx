import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize theme before React renders
const initializeTheme = () => {
  const stored = localStorage.getItem('theme-storage')
  if (stored) {
    try {
      const { state } = JSON.parse(stored)
      if (state?.mode) {
        const root = document.documentElement
        root.classList.remove('light', 'dark', 'nature', 'solarized')
        root.classList.add(state.mode)
      }
    } catch (e) {
      console.error('Failed to parse theme storage:', e)
      document.documentElement.classList.add('light')
    }
  } else {
    document.documentElement.classList.add('light')
  }
}

// Apply theme immediately
initializeTheme()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
