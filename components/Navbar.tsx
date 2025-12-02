"use client"

import { useState } from "react"
import ThemeToggle from "@/components/ThemeTogle"
import { auth } from "@/app/firebase/config"
import { LogOut, Home } from "lucide-react"
import { signOut } from "firebase/auth"
import axios from "axios"
import FullScreenLoader from "./FullScreenLoader"

export default function Navbar() {
  const [mostrarTooltipMobile, setMostrarTooltipMobile] = useState(false)
  const [loadingLogout, setLoadingLogout] = useState(false)
  const [openLogout, setOpenLogout] = useState(false)

  const handleLogout = async () => {
    try {
      setLoadingLogout(true)
      await signOut(auth)
      await axios("/api/auth/logout", { method: "POST" })
      window.location.href = "/login"
    } catch (error) {
      console.error("Error signing out:", error)
      setLoadingLogout(false)
    }
  }

  if (loadingLogout) {
    return <FullScreenLoader />
  }

  const getUserDisplayName = () => {
    if (auth.currentUser?.email) return auth.currentUser.email.split("@")[0]
    return ""
  }

  const handleHomeClick = () => {
    window.location.href = window.location.href
  }

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:block bg-red-600 text-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Title */}
            <div className="flex-shrink-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-wide">Contrataciones</h1>
            </div>

            {/* User section */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />

              <div className="flex items-center gap-2 text-sm relative group">
                {auth.currentUser?.photoURL && (
                  <img
                    src={auth.currentUser.photoURL || "/placeholder.svg"}
                    alt="User avatar"
                    className="w-8 h-8 lg:w-10 lg:h-10 rounded-full object-cover cursor-pointer ring-2 ring-white/30 hover:ring-white/60 transition-all"
                  />
                )}
                <span className="cursor-pointer transition-colors truncate max-w-32 lg:max-w-none">
                  👋 Hola,{" "}
                  <span className="px-2 py-1 bg-gray-100/20 rounded-full hover:bg-gray-100/35">
                    {getUserDisplayName()}
                  </span>
                </span>

                {/* Tooltip */}
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2
                    bg-gray-800 text-white text-xs rounded-md px-3 py-2
                    opacity-0 group-hover:opacity-100
                    pointer-events-none transition-all duration-200 whitespace-nowrap
                    before:content-[''] before:absolute before:bottom-full before:left-1/2
                    before:-translate-x-1/2 before:border-4 before:border-transparent
                    before:border-b-gray-800"
                >
                  {auth.currentUser?.email}
                </div>
              </div>

              {/* Logout button */}
              <button
                onClick={() => setOpenLogout(!openLogout)}
                className="p-2 lg:p-3 hover:bg-red-700 rounded-lg transition-all duration-200
                    hover:scale-105 active:scale-95 focus:outline-none focus:ring-2
                    focus:ring-white/50"
                title="Cerrar sesión"
              >
                <LogOut size={20} className="lg:w-5 lg:h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
        {mostrarTooltipMobile && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-30" onClick={() => setMostrarTooltipMobile(false)} />
            {/* User tooltip */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 mb-2 bg-gray-800 text-white rounded-lg px-4 py-3 shadow-xl z-50 min-w-max">
              <div className="font-medium">{getUserDisplayName()}</div>
              <div className="text-gray-300 text-xs mt-1">{auth.currentUser?.email}</div>
            </div>
          </>
        )}

        {/* Navigation Bar */}
        <nav className="bg-red-600 text-white shadow-2xl border-t border-red-700">
          <div className="flex items-center justify-around h-20 px-2">
            {/* Home */}
            <button
              onClick={handleHomeClick}
              className="flex flex-col items-center justify-center w-full h-full gap-1 hover:bg-red-700 transition-colors rounded-lg py-2"
              title="Inicio"
            >
              <Home size={24} className="text-white" />
              <span className="text-xs font-medium text-white">Inicio</span>
            </button>

            {/* Theme Toggle */}
            <div className="flex flex-col items-center justify-center w-full h-full">
              <div className="flex justify-center">
                <ThemeToggle />
              </div>
              <span className="text-xs font-medium text-white">Tema</span>
            </div>

            {/* User Profile */}
            <button
              onClick={() => setMostrarTooltipMobile(!mostrarTooltipMobile)}
              className="flex flex-col items-center justify-center w-full h-full gap-1 hover:bg-red-700 transition-colors rounded-lg py-2"
              title="Perfil"
            >
              {auth.currentUser?.photoURL ? (
                <img
                  src={auth.currentUser.photoURL || "/placeholder.svg"}
                  alt="User avatar"
                  className="w-6 h-6 rounded-full object-cover ring-2 ring-white/70 transition-all"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-sky-400 flex items-center justify-center">
                  <span className="text-white font-semibold text-xs">
                    {auth.currentUser?.email ? auth.currentUser.email.charAt(0).toUpperCase() : "U"}
                  </span>
                </div>
              )}
              <span className="text-xs font-medium text-white">Perfil</span>
            </button>

            {/* Logout */}
            <button
              onClick={() => setOpenLogout(!openLogout)}
              className="flex flex-col items-center justify-center w-full h-full gap-1 hover:bg-red-700 transition-colors rounded-lg py-2"
              title="Cerrar sesión"
            >
              <LogOut size={24} className="text-white" />
              <span className="text-xs font-medium text-white">Salir</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Add padding to main content on mobile to account for bottom nav */}
      <style jsx>{`
        @media (max-width: 768px) {
          body {
            padding-bottom: 80px;
          }
        }
      `}</style>

      {/* Logout Modal */}
      {openLogout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-sm mx-4">
            <h2 className="text-lg font-bold mb-4">Confirmar cierre de sesión</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">¿Deseas cerrar sesión?</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setOpenLogout(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
