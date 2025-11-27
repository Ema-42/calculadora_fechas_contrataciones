"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Calendar, Plus, Trash2, X, Info, Edit, Check } from "lucide-react";

import ConfirmDeleteFeriadoModal from "./ConfirmDeleteFeriadoModal";
import { showToast } from "nextjs-toast-notify";
interface Feriado {
  id: number;
  fecha: string;
  nombre: string;
}

interface GestorFeriadosProps {
  feriados: Feriado[];
  onAgregar: (fecha: string, nombre: string) => void;
  onEliminar: (id: number) => void;
  onEditar: (id: number, fecha: string, nombre: string) => void;
}

export default function GestorFeriados({
  feriados,
  onAgregar,
  onEliminar,
  onEditar,
}: GestorFeriadosProps) {
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [feriadoSeleccionado, setFeriadoSeleccionado] = useState<number | null>(
    null
  );
  const [feriadoNombreSeleccionado, setFeriadoNombreSeleccionado] = useState<
    string | null
  >(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [editFecha, setEditFecha] = useState<string>("");
  const [editNombre, setEditNombre] = useState<string>("");
  const [editLoading, setEditLoading] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  const notifySuccess = (msg: string) => {
    showToast.success(msg, {
      duration: 2000,
      progress: true,
      position: "top-right",
      transition: "bounceIn",
      icon: "",
      sound: true,
    });
  };

  const notifyError = (msg: string) => {
    showToast.error(msg, {
      duration: 2000,
      progress: true,
      position: "top-right",
      transition: "bounceIn",
      icon: "",
      sound: true,
    });
  };

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

  const startEdit = (
    id: number,
    fechaActual?: string,
    nombreActual?: string
  ) => {
    setEditId(id);
    // Convertir la fecha al formato YYYY-MM-DD para el input type="date"
    if (fechaActual) {
      const fechaSinZ = fechaActual.replace(/Z$/, "");
      const fechaObj = new Date(fechaSinZ);
      const fechaFormato = fechaObj.toISOString().split("T")[0]; // "YYYY-MM-DD"
      setEditFecha(fechaFormato);
    } else {
      setEditFecha("");
    }
    setEditNombre(nombreActual ?? "");
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditFecha("");
    setEditNombre("");
  };

  const saveEdit = () => {
    if (editId === null) return;
    if (!editFecha || !editNombre || editNombre.trim().length === 0) {
      notifyError("La fecha y nombre no pueden quedar vacíos");
      return;
    }

    onEditar(editId, editFecha, editNombre.trim());
    cancelEdit();
  };

  useEffect(() => {
    if (editId !== null && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editId]);

  return (
    <>
      <div className="w-full md:w-1/5 pb-4 md:pr-2">
        <button
          onClick={() => setModalAbierto(true)}
          className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center shadow-md dark:shadow-gray-900/50"
        >
          <Calendar className="mr-2" size={20} />
            FERIADOS
        </button>
      </div>

      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[hsl(217,26%,14%)] rounded-lg shadow-xl dark:shadow-gray-900/50 w-full max-w-5xl max-h-[90vh] relative flex flex-col">
            <div className="sticky top-0 bg-green-600 dark:bg-green-700 px-6 py-4 rounded-t-lg flex items-center justify-between z-10 flex-shrink-0">
              <div>
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Calendar className="mr-2 text-white" size={24} />
                  Gestionar Feriados
                </h2>
                <h4 className="mt-1 text-xs text-gray-200 dark:text-gray-300">
                  En esta sección puedes agregar, ver y eliminar los feriados de
                  la gestión.
                </h4>
              </div>
              <button
                onClick={() => setModalAbierto(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="px-6 pb-6 pt-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Columna izquierda: Formulario e info */}
              <div className="flex flex-col gap-4 md:col-span-1">
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3 md:p-4 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <Info className="h-4 w-4 md:h-5 md:w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <h4 className="text-xs font-bold md:text-sm text-emerald-800 dark:text-emerald-300">
                      Feriados del {new Date().getFullYear()}
                    </h4>
                  </div>
                  <p className="text-xs md:text-sm text-emerald-700 dark:text-emerald-400 leading-relaxed">
                    Los feriados que agregues aquí solo aplican para este año.
                    Al cambiar de gestión, se borrarán y deberás registrar los
                    nuevos.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                      Fecha
                    </label>
                    <input
                      type="date"
                      value={nuevaFecha}
                      onChange={(e) => setNuevaFecha(e.target.value)}
                      required
                      className="w-full h-[42px] px-3 border border-gray-300 dark:border-gray-700 dark:bg-[hsl(217,26%,20%)] dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                      Nombre del Feriado
                    </label>
                    <input
                      type="text"
                      value={nuevoNombre}
                      onChange={(e) => setNuevoNombre(e.target.value)}
                      required
                      placeholder="Ej: Día de la Independencia"
                      className="w-full h-[42px] px-3 border border-gray-300 dark:border-gray-700 dark:bg-[hsl(217,26%,20%)] dark:text-gray-200 dark:placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full h-[42px] bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white px-4 rounded-md font-medium transition-colors flex items-center justify-center"
                  >
                    <Plus className="mr-2" size={16} />
                    Agregar Feriado
                  </button>
                </form>
              </div>

              {/* Columna derecha: Lista de feriados agrupados por mes */}
              <div className="flex flex-col gap-4 min-h-0 md:col-span-2">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 flex-shrink-0">
                  Feriados del {new Date().getFullYear()}, ({feriados.length})
                </h3>

                <div className="overflow-y-auto flex-1 min-h-0">
                  {Object.keys(grupos).length === 0 ? (
                    <p className="text-gray-800 dark:text-gray-300 text-center py-4">
                      No hay feriados registrados
                    </p>
                  ) : (
                    <div className="space-y-6 border border-green-500/35 dark:border-gray-600 rounded-lg p-2">
                      {Object.entries(grupos).map(
                        ([mesAno, feriadosDelMes]) => (
                          <div key={mesAno} className="space-y-3">
                            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 capitalize border-b border-green-400/40 dark:border-gray-600 pb-2">
                              {mesAno}
                            </h4>
                            <div className="grid grid-cols-1 gap-3">
                              {feriadosDelMes.map((feriado) => (
                                <div
                                  key={feriado.id}
                                  className="flex items-center justify-between p-3 bg-gray-200 dark:bg-[hsl(217,26%,20%)] rounded-lg hover:bg-gray-300 dark:hover:bg-[hsl(217,26%,24%)] transition-colors"
                                >
                                  <div className="flex-1 min-w-0">
                                    {editId === feriado.id ? (
                                      <div className="space-y-2">
                                        <input
                                          ref={editInputRef}
                                          type="date"
                                          value={editFecha}
                                          onChange={(e) =>
                                            setEditFecha(e.target.value)
                                          }
                                          className="w-full h-[36px] px-3 border border-gray-300 dark:border-gray-700 dark:bg-[hsl(217,26%,20%)] dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                          disabled={editLoading}
                                        />
                                        <input
                                          type="text"
                                          value={editNombre}
                                          onChange={(e) =>
                                            setEditNombre(e.target.value)
                                          }
                                          className="w-full h-[36px] px-3 border border-gray-300 dark:border-gray-700 dark:bg-[hsl(217,26%,20%)] dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                          disabled={editLoading}
                                        />
                                      </div>
                                    ) : (
                                      <>
                                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                          {feriado.nombre}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                                          {formatearFechaSimple(feriado.fecha)}
                                        </p>
                                      </>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                                    {editId === feriado.id ? (
                                      <>
                                        <button
                                          onClick={saveEdit}
                                          title="Guardar"
                                          className="p-2.5 rounded transition-colors bg-green-50 hover:bg-green-100 dark:bg-green-800/30 dark:hover:bg-green-700/40 text-green-600 dark:text-green-200"
                                        >
                                          <Check size={16} />
                                        </button>
                                        <button
                                          onClick={cancelEdit}
                                          title="Cancelar"
                                          className="p-2.5 rounded transition-colors bg-red-50 hover:bg-red-100 dark:bg-red-800/30 dark:hover:bg-red-700/40 text-red-600 dark:text-red-200"
                                        >
                                          <X size={16} />
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        <button
                                          onClick={() =>
                                            startEdit(
                                              feriado.id,
                                              feriado.fecha,
                                              feriado.nombre
                                            )
                                          }
                                          title="Editar"
                                          className="p-2.5 rounded transition-colors bg-amber-50 hover:bg-amber-100 dark:bg-amber-800/30 dark:hover:bg-amber-700/40 text-amber-600 dark:text-amber-200"
                                        >
                                          <Edit size={16} />
                                        </button>
                                        <button
                                          onClick={() => (
                                            setFeriadoNombreSeleccionado(
                                              feriado.nombre
                                            ),
                                            handleOpenModal(feriado.id)
                                          )}
                                          title="Eliminar"
                                          className="p-2.5 rounded transition-colors bg-red-50 hover:bg-red-100 dark:bg-red-800/30 dark:hover:bg-red-700/40 text-red-600 dark:text-red-200"
                                        >
                                          <Trash2 size={16} />
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteFeriadoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmDelete}
        feriadoNombre={feriadoNombreSeleccionado}
      />
    </>
  );
}

