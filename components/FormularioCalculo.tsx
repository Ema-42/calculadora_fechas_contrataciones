"use client"

import type React from "react"

import { useState } from "react"
import { Calculator } from "lucide-react"

interface FormularioCalculoProps {
  onSubmit: (datos: {
    titulo: string
    fechaInicio: string
    monto: number
    modalidad: string
  }) => void
}

export default function FormularioCalculo({ onSubmit }: FormularioCalculoProps) {
  const [titulo, setTitulo] = useState("")
  const [fechaInicio, setFechaInicio] = useState("")
  const [monto, setMonto] = useState("")
  const [modalidad, setModalidad] = useState("")

  const modalidades = ["ANPE menor", "ANPE mayor", "Contratación pública", "Contratación directa"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!fechaInicio || !monto || !modalidad) {
      alert("Por favor complete todos los campos requeridos")
      return
    }

    onSubmit({
      titulo,
      fechaInicio,
      monto: Number.parseFloat(monto),
      modalidad,
    })

    // Limpiar formulario
    setTitulo("")
    setFechaInicio("")
    setMonto("")
    setModalidad("")
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <Calculator className="mr-2 text-red-600" size={24} />
        Nuevo Cálculo de Fechas
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título (Opcional)</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Descripción del proceso"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Inicio <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monto <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Modalidad <span className="text-red-500">*</span>
            </label>
            <select
              value={modalidad}
              onChange={(e) => setModalidad(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Seleccionar modalidad</option>
              {modalidades.map((mod) => (
                <option key={mod} value={mod}>
                  {mod}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium transition-colors flex items-center"
          >
            <Calculator className="mr-2" size={16} />
            Calcular Fechas
          </button>
        </div>
      </form>
    </div>
  )
}
