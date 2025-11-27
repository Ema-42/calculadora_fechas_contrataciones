'use client'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Leer preferencia guardada
    const theme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (theme === 'dark' || (!theme && prefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setIsDark(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setIsDark(true)
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-black/30 dark:bg-white/30 border border-white/20 dark:border-white/10 backdrop-blur-md backdrop-saturate-150 shadow-sm hover:shadow-md transition-colors animate-pulse relative flex items-center justify-center"
      aria-label="Toggle dark mode"
      title="Modo oscuro/claro"
    >
      {/* Icones de lucide-react no se ven afectados por la animación */}
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-400 dark:text-yellow-300 animate-none" aria-hidden="true" />
      ) : (
        <Moon className="w-5 h-5 text-gray-100 dark:text-gray-200 animate-none" aria-hidden="true" />
      )}
    </button>
  )
}