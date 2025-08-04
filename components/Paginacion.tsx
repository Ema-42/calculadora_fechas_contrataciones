"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginacionProps {
  paginaActual: number
  totalPaginas: number
  onCambioPagina: (pagina: number) => void
}

export default function Paginacion({ paginaActual, totalPaginas, onCambioPagina }: PaginacionProps) {
  const generarNumerosPagina = () => {
    const numeros = []
    const rango = 2 // Mostrar 2 páginas antes y después de la actual

    let inicio = Math.max(1, paginaActual - rango)
    let fin = Math.min(totalPaginas, paginaActual + rango)

    // Ajustar para mostrar siempre 5 números si es posible
    if (fin - inicio < 4) {
      if (inicio === 1) {
        fin = Math.min(totalPaginas, inicio + 4)
      } else if (fin === totalPaginas) {
        inicio = Math.max(1, fin - 4)
      }
    }

    for (let i = inicio; i <= fin; i++) {
      numeros.push(i)
    }

    return numeros
  }

  if (totalPaginas <= 1) return null

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-700">
        Página {paginaActual} de {totalPaginas}
      </div>

      <div className="flex items-center space-x-1">
        <button
          onClick={() => onCambioPagina(paginaActual - 1)}
          disabled={paginaActual === 1}
          className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
        </button>

        {generarNumerosPagina().map((numero) => (
          <button
            key={numero}
            onClick={() => onCambioPagina(numero)}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              numero === paginaActual
                ? "bg-red-600 text-white"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {numero}
          </button>
        ))}

        <button
          onClick={() => onCambioPagina(paginaActual + 1)}
          disabled={paginaActual === totalPaginas}
          className="p-2 rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
