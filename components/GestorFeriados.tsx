"use client"

import type React from "react"

import { useState } from "react"
import { Calendar, Plus, Trash2 } from "lucide-react"

interface Feriado {
  id: number
  fecha: string
  nombre: string
}

interface GestorFeriadosProps {
  feriados: Feriado[]
  onAgregar: (fecha: string, nombre: string) => void
  onEliminar: (id: number) => void
}

export default function GestorFeriados({ feriados, onAgregar, onEliminar }: GestorFeriadosProps) {
  const [nuevaFecha, setNuevaFecha] = useState("")
  const [nuevoNombre, setNuevoNombre] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!nuevaFecha || !nuevoNombre) {
      alert("Por favor complete todos los campos")
      return
    }

    // Verificar si ya existe un feriado en esa fecha
    if (feriados.some((feriado) => feriado.fecha === nuevaFecha)) {
      alert("Ya existe un feriado en esa fecha")
      return
    }

    onAgregar(nuevaFecha, nuevoNombre)
    setNuevaFecha("")
    setNuevoNombre("")
  }

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <Calendar className="mr-2 text-blue-600" size={24} />
        Gestión de Feriados
      </h2>

      {/* Formulario para agregar feriado */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input
              type="date"
              value={nuevaFecha}
              onChange={(e) => setNuevaFecha(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Feriado</label>
            <input
              type="text"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
              required
              placeholder="Ej: Día de la Independencia"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center"
            >
              <Plus className="mr-2" size={16} />
              Agregar Feriado
            </button>
          </div>
        </div>
      </form>

      {/* Lista de feriados */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-gray-800">Feriados Registrados ({feriados.length})</h3>

        {feriados.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No hay feriados registrados</p>
        ) : (
          <div className="max-h-60 overflow-y-auto">
            {feriados.map((feriado) => (
              <div
                key={feriado.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900">{feriado.nombre}</p>
                  <p className="text-sm text-gray-500 capitalize">{formatearFecha(feriado.fecha)}</p>
                </div>
                <button
                  onClick={() => onEliminar(feriado.id)}
                  className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                  title="Eliminar feriado"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
