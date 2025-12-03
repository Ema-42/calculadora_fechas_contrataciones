"use client";

import type React from "react";

import { useState } from "react";
import { Calculator } from "lucide-react";
import { Modalidad } from "@/app/interfaces/interfaces";
 
interface FormularioCalculoProps {
  onSubmit: (datos: {
    titulo: string;
    fechaInicio: string;
    monto?: number;
    modalidadId: number;
    saving?: boolean;
  }) => void;
  loading?: boolean;
  modalidades: Modalidad[];
}

export default function FormularioCalculo({
  onSubmit,
  modalidades,
  loading,
}: FormularioCalculoProps) {
  const [titulo, setTitulo] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [monto, setMonto] = useState("");
  const [modalidad, setModalidad] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fechaInicio || !modalidad) {
      alert("Por favor complete todos los campos requeridos");
      return;
    }
    const tituloEnMayusculas = titulo.toUpperCase();
    onSubmit({
      titulo: tituloEnMayusculas,
      fechaInicio,
      monto: Number.parseFloat(monto),
      modalidadId: Number(modalidad),
      saving: true,
    });

    setTitulo("");
    setFechaInicio("");
    setMonto("");
    setModalidad("");
  };

  return (
    <div className="bg-gray-500/20 dark:bg-[hsl(217,26%,16%)] rounded-lg shadow-md dark:shadow-gray-900/50 px-4 py-3">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
        <Calculator className="mr-2 text-red-600 dark:text-red-500" size={24} />
        Nuevo Registro
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Título (Opcional)
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-[hsl(217,26%,18%)] dark:text-gray-200 dark:placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Descripción del proceso"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Fecha de Inicio <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-[hsl(217,26%,18%)] dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Monto (Opcional)
            </label>
            <input
              type="number"
              step="1"
              min="0"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-[hsl(217,26%,18%)] dark:text-gray-200 dark:placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Modalidad <span className="text-red-500 dark:text-red-400">*</span>
            </label>
            <select
              value={modalidad}
              onChange={(e) => setModalidad(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-[hsl(217,26%,18%)] dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Seleccionar modalidad</option>
              {modalidades.map((mod) => (
                <option key={mod.id} value={mod.id}>
                  {mod.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex sm:justify-end ">
          <button
            type="submit"
            className={`  justify-center w-full md:w-auto  bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white px-6 py-2 rounded-md font-medium transition-colors flex items-center`}
            disabled={loading}
          >
            <Calculator className="mr-2" size={16} />
            {loading ? "Calculando..." : "Calcular Fechas"}
          </button>
        </div>
      </form>
    </div>
  );
}

