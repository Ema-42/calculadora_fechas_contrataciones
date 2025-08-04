"use client"

import { useEffect } from "react"
import { CheckCircle, X } from "lucide-react"

interface ToastProps {
  message: string
  onClose: () => void
}

export default function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
      <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-3 min-w-[300px]">
        <CheckCircle size={20} />
        <span className="flex-1">{message}</span>
        <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
