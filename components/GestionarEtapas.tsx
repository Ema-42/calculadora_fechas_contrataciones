"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  X,
  Info,
  Edit,
  Check,
  ArrowBigRight,
} from "lucide-react";

import ConfirmDeleteEtapaModal from "./ConfirmDeleteEtapaModal";
import { Etapa } from "@/app/interfaces/interfaces";
import { showToast } from "nextjs-toast-notify";

interface GestionarEtapasProps {
  etapas: Etapa[]; // se llama etapas para mantener compatibilidad con uso existente
  onAgregar: (nombre: string) => void;
  onEliminar: (id: number) => void;
  onEditar: (id: number, nombre: string) => void;
  obtenerUno?: (id: number) => Promise<Etapa | null>;
}

export default function GestionarEtapas({
  etapas,
  onAgregar,
  onEliminar,
  onEditar,
  obtenerUno,
}: GestionarEtapasProps) {
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [itemSeleccionado, setItemSeleccionado] = useState<number | null>(null);
  const [itemNombreSeleccionado, setItemNombreSeleccionado] = useState<
    string | null
  >(null);

  const [editId, setEditId] = useState<number | null>(null);
  const [editNombre, setEditNombre] = useState<string>("");
  const [editLoading, setEditLoading] = useState(false);

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

    if (!nuevoNombre) {
      alert("Por favor complete el nombre de la etapa");
      return;
    }

    // evitar duplicados simples
    if (
      etapas.some(
        (f) =>
          (f.nombre || "").trim().toLowerCase() ===
          nuevoNombre.trim().toLowerCase()
      )
    ) {
      notifyError("Ya existe una etapa con ese nombre");
      return;
    }

    onAgregar(nuevoNombre.trim());
    setNuevoNombre("");
  };

  const formatearNombre = (nombre: string) => nombre || "-";

  const handleOpenModal = (id: number, nombre: string) => {
    setItemSeleccionado(id);
    setItemNombreSeleccionado(nombre);
    setModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemSeleccionado !== null) onEliminar(itemSeleccionado);
    setModalOpen(false);
    setItemSeleccionado(null);
  };

  const startEdit = (id: number, nombreActual?: string) => {
    setEditId(id);
    setEditNombre(nombreActual ?? "");
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditNombre("");
  };

  const saveEdit = () => {
    if (editId === null) return;
    if (!editNombre || editNombre.trim().length === 0) {
      notifyError("El nombre no puede quedar vacío");
      return;
    }

    onEditar(editId, editNombre.trim());
    cancelEdit();
  };

  // Agrupar por primera letra como ejemplo simple (puedes adaptar)
  const grupos: { [key: string]: Etapa[] } = {};
  [...etapas]
    .sort((a, b) => (a.nombre || "").localeCompare(b.nombre || ""))
    .forEach((etapa) => {
      const key = (etapa.nombre || "")[0]?.toUpperCase() ?? "#";
      if (!grupos[key]) grupos[key] = [];
      grupos[key].push(etapa);
    });

  return (
    <>
      <div className="w-1/3 pr-2  md:w-1/5 pb-4 md:pr-2">
        <button
          onClick={() => setModalAbierto(true)}
          className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white px-1 py-2 rounded-lg font-medium transition-colors flex items-center justify-center shadow-md dark:shadow-gray-900/50"
        >
          <ArrowBigRight className="mr-2 hidden md:block" size={20} />
          ETAPAS
        </button>
      </div>

      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[hsl(217,26%,14%)] rounded-lg shadow-xl dark:shadow-gray-900/50 w-full max-w-5xl max-h-[90vh] relative flex flex-col">
            <div className="sticky top-0 bg-green-600 dark:bg-green-700 px-6 py-4 rounded-t-lg flex items-center justify-between z-10 flex-shrink-0">
              <div>
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Info className="mr-2 text-white" size={24} />
                  Gestionar Etapas
                </h2>
              </div>
              <button
                onClick={() => setModalAbierto(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="px-6 pb-6 pt-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Columna izquierda: Formulario */}
              <div className="flex flex-col gap-4 md:col-span-1">
                <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3 md:p-4 rounded-lg">
                  <div className="flex items-center space-x-3 ">
                    <Info className="h-4 w-4 md:h-5 md:w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <p className="text-xs md:text-sm text-emerald-700 dark:text-emerald-400 leading-relaxed">
                      Agrega nuevas etapas o edita las existentes directamente
                      desde la lista.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={nuevoNombre}
                      onChange={(e) => setNuevoNombre(e.target.value)}
                      required
                      placeholder="Ej: Evaluación"
                      className="w-full h-[42px] px-3 border border-gray-300 dark:border-gray-700 dark:bg-[hsl(217,26%,20%)] dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full h-[42px] bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white px-4 rounded-md font-medium transition-colors flex items-center justify-center"
                  >
                    <Plus className="mr-2" size={16} />
                    Agregar Etapa
                  </button>
                </form>
              </div>

              {/* Columna derecha: Lista */}
              <div className="flex flex-col gap-4 md:col-span-2">
                <div className="h-96 overflow-y-auto border border-gray-300 dark:border-gray-700 rounded-lg">
                  {etapas.length === 0 ? (
                    <p className="text-gray-800 dark:text-gray-300 text-center py-4">
                      No hay etapas registradas
                    </p>
                  ) : (
                    <div className="space-y-3 p-3">
                      {[...etapas]
                        .sort((a, b) =>
                          (a.nombre || "").localeCompare(b.nombre || "")
                        )
                        .map((etapa) => (
                          <div
                            key={etapa.id}
                            className="flex items-center justify-between p-3 bg-gray-200 dark:bg-[hsl(217,26%,20%)] rounded-lg hover:bg-gray-300 dark:hover:bg-[hsl(217,26%,24%)] transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              {editId === etapa.id ? (
                                <input
                                  value={editNombre}
                                  onChange={(e) =>
                                    setEditNombre(e.target.value)
                                  }
                                  className="w-full h-[38px] px-3 border border-gray-300 dark:border-gray-700 dark:bg-[hsl(217,26%,20%)] dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                  disabled={editLoading}
                                />
                              ) : (
                                <>
                                  <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                    {formatearNombre(etapa.nombre)}
                                  </p>
                                </>
                              )}
                            </div>

                            <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                              {editId === etapa.id ? (
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
                                      startEdit(etapa.id, etapa.nombre)
                                    }
                                    title="Editar"
                                    className="p-2.5 rounded transition-colors bg-amber-50 hover:bg-amber-100 dark:bg-amber-800/30 dark:hover:bg-amber-700/40 text-amber-600 dark:text-amber-200"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button
                                    onClick={() => (
                                      setItemNombreSeleccionado(etapa.nombre),
                                      handleOpenModal(etapa.id, etapa.nombre)
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
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteEtapaModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmDelete}
        etapaNombre={itemNombreSeleccionado}
      />
    </>
  );
}
