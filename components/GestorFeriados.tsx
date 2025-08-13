"use client";

import type React from "react";

import { useState } from "react";
import {
  Calendar,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import ConfirmDeleteFeriadoModal from "./ConfirmDeleteFeriadoModal";
import { set } from "date-fns";
interface Feriado {
  id: number;
  fecha: string;
  nombre: string;
}

interface GestorFeriadosProps {
  feriados: Feriado[];
  onAgregar: (fecha: string, nombre: string) => void;
  onEliminar: (id: number) => void;
}

export default function GestorFeriados({
  feriados,
  onAgregar,
  onEliminar,
}: GestorFeriadosProps) {
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [desplegado, setDesplegado] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [feriadoSeleccionado, setFeriadoSeleccionado] = useState<number | null>(
    null
  );
  const [feriadoNombreSeleccionado, setFeriadoNombreSeleccionado] = useState<
    string | null
  >(null);

  const notifyError = (msg: string) =>
    toast.error(msg, {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: true,
      closeOnClick: false,
      closeButton: false,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nuevaFecha || !nuevoNombre) {
      alert("Por favor complete todos los campos");
      return;
    }

    // Verificar si ya existe un feriado en esa fecha
    if (
      feriados.some((feriado) => {
        const fechaBD = new Date(feriado.fecha).toISOString().split("T")[0]; // "YYYY-MM-DD"
        return fechaBD === nuevaFecha;
      })
    ) {
      notifyError(`Ya existe un feriado en la fecha`);
      return;
    }

    onAgregar(nuevaFecha, nuevoNombre);
    setNuevaFecha("");
    setNuevoNombre("");
  };

  const formatearFechaSimple = (fecha: string) => {
    // Eliminar la "Z" para evitar conversión de zona horaria
    const fechaSinZ = fecha.replace(/Z$/, "");
    const fechaObj = new Date(fechaSinZ);
    return fechaObj.toLocaleDateString("es-BO", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatearFechaSinDia = (fecha: string) => {
    // Eliminar la "Z" para evitar conversión de zona horaria
    const fechaSinZ = fecha.replace(/Z$/, "");
    const fechaObj = new Date(fechaSinZ);
    return fechaObj.toLocaleDateString("es-BO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatearMesAno = (fecha: string) => {
    const fechaSinZ = fecha.replace(/Z$/, "");
    const fechaObj = new Date(fechaSinZ);
    return fechaObj.toLocaleDateString("es-BO", {
      month: "long",
      year: "numeric",
    });
  };

  // Ordenar feriados por fecha y agrupar por mes
  const feriadosOrdenadosYAgrupados = () => {
    const feriadosOrdenados = [...feriados].sort(
      (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    );

    const grupos: { [mesAno: string]: Feriado[] } = {};

    feriadosOrdenados.forEach((feriado) => {
      const mesAno = formatearMesAno(feriado.fecha);
      if (!grupos[mesAno]) {
        grupos[mesAno] = [];
      }
      grupos[mesAno].push(feriado);
    });

    return grupos;
  };

  const grupos = feriadosOrdenadosYAgrupados();

  const handleOpenModal = (id: number) => {
    setFeriadoSeleccionado(id);
    setModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (feriadoSeleccionado !== null) {
      onEliminar(feriadoSeleccionado);
    }
    setModalOpen(false);
    setFeriadoSeleccionado(null);
  };

  return (
    <div className=" shadow-md">
      {/* Header siempre visible */}
      <div
        className={`p-6 cursor-pointer bg-red-600  hover:bg-red-700 rounded-tr-lg rounded-tl-lg  transition-colors ${
          !desplegado && "rounded-br-lg rounded-bl-lg"
        }`}
        onClick={() => setDesplegado(!desplegado)}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Calendar className="mr-2 text-white" size={24} />
            Gestionar de Feriados
          </h2>

          <div className="text-white">
            {desplegado ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
          </div>
        </div>
        <h4 className="mt-1 text-xs text-gray-300">
          En esta sección puedes agregar, ver y eliminar los feriados de la
          gestión.
        </h4>
      </div>

      {/* Contenido desplegable */}
      {desplegado && (
        <div className="px-6 pb-6 bg-white ">
          <form onSubmit={handleSubmit} className="mb-6 border-t pt-6">
            <div className="bg-gradient-to-r from-amber-50 to-yellow-100 border border-amber-200 p-3 md:p-4 mb-6 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <Info className="h-4 w-4 md:h-5 md:w-5 text-amber-600 flex-shrink-0" />
                <h4 className="text-xs font-bold md:text-sm text-amber-800">
                  Gestión de Feriados {new Date().getFullYear()}
                </h4>
              </div>
              <p className="text-xs md:text-sm text-amber-700 leading-relaxed">
                Los feriados registrados son válidos solo para este año. Al
                cambiar de gestión, se eliminarán automáticamente y deberán
                cargarse los nuevos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  value={nuevaFecha}
                  onChange={(e) => setNuevaFecha(e.target.value)}
                  required
                  className="w-full h-[42px] px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">
                  Nombre del Feriado
                </label>
                <input
                  type="text"
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  required
                  placeholder="Ej: Día de la Independencia"
                  className="w-full h-[42px] px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full h-[42px] bg-red-600 hover:bg-red-700 text-white px-4 rounded-md font-medium transition-colors flex items-center justify-center"
                >
                  <Plus className="mr-2" size={16} />
                  Agregar Feriado
                </button>
              </div>
            </div>
          </form>

          {/* Lista de feriados agrupados por mes */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-800">
              Feriados del {new Date().getFullYear()}, ({feriados.length})
            </h3>

            {Object.keys(grupos).length === 0 ? (
              <p className="text-gray-800 text-center py-4">
                No hay feriados registrados
              </p>
            ) : (
              <div className="max-h-96 overflow-y-auto space-y-6 border border-red-500/35 rounded-lg p-2">
                {Object.entries(grupos).map(([mesAno, feriadosDelMes]) => (
                  <div key={mesAno} className="space-y-3">
                    <h4 className="text-md font-medium text-gray-800 capitalize border-b border-red-400/40 pb-2">
                      {mesAno}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {feriadosDelMes.map((feriado) => (
                        <div
                          key={feriado.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {feriado.nombre}
                            </p>
                            <p className="text-sm text-gray-500 capitalize">
                              {formatearFechaSimple(feriado.fecha)}
                            </p>
                          </div>
                          <button
                            onClick={() => (
                              setFeriadoNombreSeleccionado(feriado.nombre),
                              handleOpenModal(feriado.id)
                            )}
                            className="text-red-600 hover:text-red-800 p-1 rounded transition-colors flex-shrink-0 ml-2"
                            title="Eliminar feriado"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <ConfirmDeleteFeriadoModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            onConfirm={handleConfirmDelete}
            feriadoNombre={feriadoNombreSeleccionado}
          />
          <ToastContainer />
        </div>
      )}
    </div>
  );
}

