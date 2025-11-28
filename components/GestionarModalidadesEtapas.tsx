"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  X,
  Info,
  Edit,
  Check,
  Settings,
  CheckCircle,
  XCircle,
} from "lucide-react";
import ConfirmDeleteModalidadEtapaModal from "./ConfirmDeleteModalidadEtapaModal";
import { showToast } from "nextjs-toast-notify";

interface Etapa {
  id: number;
  nombre: string;
  eliminado?: boolean;
}

interface Modalidad {
  id: number;
  nombre: string;
  eliminado?: boolean;
}

export interface ModalidadEtapa {
  id: number;
  etapaId: number;
  cantidad: string;
  habilitado: boolean;
  modalidadId: number;
  etapa?: Etapa;
  modalidad?: Modalidad;
}

interface GestionarModalidadesEtapasProps {
  modalidadesEtapas: ModalidadEtapa[];
  etapas: Etapa[];
  modalidades: Modalidad[];
  onAgregar: (
    modalidadId: number,
    etapaId: number,
    cantidad: string,
    habilitado: boolean
  ) => void;
  onEliminar: (id: number) => void;
  onEditar: (
    id: number,
    etapaId: number,
    cantidad: string,
    habilitado: boolean
  ) => void;
}

export default function GestionarModalidadesEtapas({
  modalidadesEtapas,
  etapas,
  modalidades,
  onAgregar,
  onEliminar,
  onEditar,
}: GestionarModalidadesEtapasProps) {
  const [nuevaModalidadId, setNuevaModalidadId] = useState<number | "">("");
  const [nuevaEtapaId, setNuevaEtapaId] = useState<number | "">("");
  const [nuevaCantidad, setNuevaCantidad] = useState("0");
  const [nuevoHabilitado, setNuevoHabilitado] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [itemSeleccionado, setItemSeleccionado] = useState<number | null>(null);
  const [itemNombreSeleccionado, setItemNombreSeleccionado] = useState<
    string | null
  >(null);

  const [editId, setEditId] = useState<number | null>(null);
  const [editEtapaId, setEditEtapaId] = useState<number | "">("");
  const [editCantidad, setEditCantidad] = useState<string>("0");
  const [editHabilitado, setEditHabilitado] = useState(true);

  /*   modalidadesEtapas = modalidadesEtapas.filter(
    (item) =>
      item?.modalidad?.eliminado !== true && item?.etapa?.eliminado !== true
  ); */

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

    if (nuevaModalidadId === "" || nuevaEtapaId === "") {
      notifyError("Por favor seleccione modalidad y etapa");
      return;
    }

    // Verificar duplicados
    if (
      modalidadesEtapas.some(
        (me) =>
          me.modalidadId === nuevaModalidadId && me.etapaId === nuevaEtapaId
      )
    ) {
      notifyError("Ya existe esta combinación de modalidad y etapa");
      return;
    }

    onAgregar(
      Number(nuevaModalidadId),
      Number(nuevaEtapaId),
      String(nuevaCantidad),
      nuevoHabilitado
    );
    setNuevaModalidadId("");
    setNuevaEtapaId("");
    setNuevaCantidad("0");
    setNuevoHabilitado(true);
  };

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

  const startEdit = (item: ModalidadEtapa) => {
    setEditId(item.id);
    setEditEtapaId(item.etapaId);
    setEditCantidad(item.cantidad || "0");
    setEditHabilitado(item.habilitado);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditEtapaId("");
    setEditCantidad("0");
    setEditHabilitado(true);
  };

  const saveEdit = () => {
    if (editId === null || editEtapaId === "") {
      notifyError("Debe seleccionar una etapa");
      return;
    }

    onEditar(editId, Number(editEtapaId), editCantidad, editHabilitado);
    cancelEdit();
  };

  const getNombreEtapa = (etapaId: number) => {
    return etapas.find((e) => e.id === etapaId)?.nombre || "-";
  };

  const getNombreModalidad = (modalidadId: number) => {
    return modalidades.find((m) => m.id === modalidadId)?.nombre || "-";
  };

  // NUEVA FUNCIÓN: Agrupar por modalidad
  const agruparPorModalidad = () => {
    const itemsOrdenados = [...modalidadesEtapas].sort((a, b) => a.id - b.id);
    const grupos: { [modalidadNombre: string]: ModalidadEtapa[] } = {};

    itemsOrdenados.forEach((item) => {
      const modalidadNombre = getNombreModalidad(item.modalidadId);
      if (!grupos[modalidadNombre]) {
        grupos[modalidadNombre] = [];
      }
      grupos[modalidadNombre].push(item);
    });

    return grupos;
  };

  const grupos = agruparPorModalidad();

  return (
    <>
      <div className="w-full md:w-2/5 pb-4 ">
        <button
          onClick={() => setModalAbierto(true)}
          className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center shadow-md dark:shadow-gray-900/50"
        >
          <Settings className="mr-2" size={20} />
          AJUSTES ETAPAS-MODALIDADES
        </button>
      </div>

      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[hsl(217,26%,14%)] rounded-lg shadow-xl dark:shadow-gray-900/50 w-full max-w-6xl max-h-[90vh] relative flex flex-col">
            <div className="sticky top-0 bg-green-600 dark:bg-green-700 px-6 py-4 rounded-t-lg flex items-center justify-between z-10 flex-shrink-0">
              <div>
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <Settings className="mr-2 text-white" size={24} />
                  Gestionar Modalidades-Etapas
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
                {/* <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3 md:p-4 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <Info className="h-4 w-4 md:h-5 md:w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    <h4 className="text-xs font-bold md:text-sm text-emerald-800 dark:text-emerald-300">
                      Relaciones registradas
                    </h4>
                  </div>
                  <p className="text-xs md:text-sm text-emerald-700 dark:text-emerald-400 leading-relaxed">
                    Configura las etapas asociadas a cada modalidad y define su
                    cantidad y estado.
                  </p>
                </div>
 */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                      Modalidad
                    </label>
                    <select
                      value={nuevaModalidadId}
                      onChange={(e) =>
                        setNuevaModalidadId(Number(e.target.value) || "")
                      }
                      required
                      className="w-full h-[42px] px-3 border border-gray-300 dark:border-gray-700 dark:bg-[hsl(217,26%,20%)] dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Seleccionar modalidad</option>
                      {modalidades.map((mod) => (
                        <option key={mod.id} value={mod.id}>
                          {mod.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                      Etapa
                    </label>
                    <select
                      value={nuevaEtapaId}
                      onChange={(e) =>
                        setNuevaEtapaId(Number(e.target.value) || "")
                      }
                      required
                      className="w-full h-[42px] px-3 border border-gray-300 dark:border-gray-700 dark:bg-[hsl(217,26%,20%)] dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="">Seleccionar etapa</option>
                      {etapas.map((etapa) => (
                        <option key={etapa.id} value={etapa.id}>
                          {etapa.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-5 md:grid-cols-1 gap-4">
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                        Duración (en días)
                      </label>
                      <input
                        type="number"
                        value={nuevaCantidad}
                        onChange={(e) => setNuevaCantidad(e.target.value)}
                        placeholder="0"
                        className="w-full h-[42px] px-3 border border-gray-300 dark:border-gray-700 dark:bg-[hsl(217,26%,20%)] dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div className="col-span-3 md:col-span-1">
                      <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1 md:mb-2">
                        Estado
                      </label>
                      <div className="flex gap-2 md:gap-4">
                        <label
                          htmlFor="habilitado"
                          className={`flex-1 rounded border p-2 text-sm font-medium shadow-sm transition-all cursor-pointer ${
                            nuevoHabilitado === true
                              ? "border-blue-600 bg-blue-50  ring-blue-600 dark:bg-blue-900 dark:border-blue-500 dark:ring-blue-500"
                              : "border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
                          }`}
                        >
                          <div className="flex items-center justify-center">
                            <span className="text-gray-700 dark:text-gray-200">
                              Habilitado
                            </span>
                          </div>
                          <input
                            id="habilitado"
                            type="radio"
                            name="estado"
                            checked={nuevoHabilitado === true}
                            onChange={() => setNuevoHabilitado(true)}
                            className="sr-only"
                          />
                        </label>

                        <label
                          htmlFor="deshabilitado"
                          className={`flex-1 rounded border p-2 text-sm font-medium shadow-sm transition-all cursor-pointer ${
                            nuevoHabilitado === false
                              ? "border-red-600 bg-red-50   ring-red-600 dark:bg-red-900 dark:border-red-500 dark:ring-red-500"
                              : "border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
                          }`}
                        >
                          <div className="flex items-center justify-center">
                            <span className="text-gray-700 dark:text-gray-200">
                              Deshabilitado
                            </span>
                          </div>
                          <input
                            id="deshabilitado"
                            type="radio"
                            name="estado"
                            checked={nuevoHabilitado === false}
                            onChange={() => setNuevoHabilitado(false)}
                            className="sr-only"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full h-[42px] bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white px-4 rounded-md font-medium transition-colors flex items-center justify-center"
                  >
                    <Plus className="mr-2" size={16} />
                    Agregar Relación
                  </button>
                </form>
              </div>

              {/* Columna derecha: Lista agrupada por modalidad */}
              <div className="flex flex-col gap-4 min-h-0 md:col-span-2">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 flex-shrink-0">
                  Relaciones ({modalidadesEtapas.length})
                </h3>

                <div className="overflow-y-auto flex-1 min-h-0">
                  {Object.keys(grupos).length === 0 ? (
                    <p className="text-gray-800 dark:text-gray-300 text-center py-4">
                      No hay relaciones registradas
                    </p>
                  ) : (
                    <div className="space-y-6 border border-green-500/35 dark:border-gray-600 rounded-lg p-2">
                      {Object.entries(grupos).map(
                        ([modalidadNombre, itemsModalidad]) => (
                          <div key={modalidadNombre} className="space-y-3">
                            <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 capitalize border-b border-green-400/40 dark:border-gray-600 pb-2">
                              {modalidadNombre}
                            </h4>
                            <div className="grid grid-cols-1 gap-3">
                              {itemsModalidad.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between p-3 bg-gray-200 dark:bg-[hsl(217,26%,20%)] rounded-lg hover:bg-gray-300 dark:hover:bg-[hsl(217,26%,24%)] transition-colors"
                                >
                                  <div className="flex-1 min-w-0">
                                    {editId === item.id ? (
                                      <div className="space-y-2">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                          <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                              Etapa
                                            </label>
                                            <select
                                              value={editEtapaId}
                                              onChange={(e) =>
                                                setEditEtapaId(
                                                  Number(e.target.value)
                                                )
                                              }
                                              className="w-full h-[38px] px-3 border border-gray-300 dark:border-gray-700 dark:bg-[hsl(217,26%,20%)] dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            >
                                              <option value="">
                                                Seleccionar etapa
                                              </option>
                                              {etapas.map((etapa) => (
                                                <option
                                                  key={etapa.id}
                                                  value={etapa.id}
                                                >
                                                  {etapa.nombre}
                                                </option>
                                              ))}
                                            </select>
                                          </div>
                                          <div>
                                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                              Duración (en días)
                                            </label>
                                            <input
                                              type="number"
                                              value={editCantidad}
                                              onChange={(e) =>
                                                setEditCantidad(e.target.value)
                                              }
                                              className="w-full h-[38px] px-3 border border-gray-300 dark:border-gray-700 dark:bg-[hsl(217,26%,20%)] dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            />
                                          </div>
                                        </div>
                                        <div className="flex gap-4">
                                          <label
                                            htmlFor="edit_habilitado"
                                            className={`flex-1 rounded border p-1 text-sm font-medium shadow-sm transition-all cursor-pointer ${
                                              editHabilitado === true
                                                ? "border-blue-600 bg-blue-50 ring-blue-600 dark:bg-blue-900 dark:border-blue-500 dark:ring-blue-500"
                                                : "border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
                                            }`}
                                          >
                                            <div className="flex items-center justify-center">
                                              <span className="text-gray-700 dark:text-gray-200">
                                                Habilitado
                                              </span>
                                            </div>
                                            <input
                                              id="edit_habilitado"
                                              type="radio"
                                              name="edit_estado"
                                              checked={editHabilitado === true}
                                              onChange={() =>
                                                setEditHabilitado(true)
                                              }
                                              className="sr-only"
                                            />
                                          </label>

                                          <label
                                            htmlFor="edit_deshabilitado"
                                            className={`flex-1 rounded border p-1 text-sm font-medium shadow-sm transition-all cursor-pointer ${
                                              editHabilitado === false
                                                ? "border-red-600 bg-red-50 ring-red-600 dark:bg-red-900 dark:border-red-500 dark:ring-red-500"
                                                : "border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
                                            }`}
                                          >
                                            <div className="flex items-center justify-center">
                                              <span className="text-gray-700 dark:text-gray-200">
                                                Deshabilitado
                                              </span>
                                            </div>
                                            <input
                                              id="edit_deshabilitado"
                                              type="radio"
                                              name="edit_estado"
                                              checked={editHabilitado === false}
                                              onChange={() =>
                                                setEditHabilitado(false)
                                              }
                                              className="sr-only"
                                            />
                                          </label>
                                        </div>
                                      </div>
                                    ) : (
                                      <>
                                        <p className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                          {getNombreEtapa(item.etapaId)} →
                                          <span className="rounded-full bg-green-600/30 px-2 py-0.5 text-sm whitespace-nowrap text-green-900 dark:text-green-200">
                                            {item.cantidad || "0"} Días
                                          </span>
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                          {item.habilitado ? (
                                            <>
                                              <CheckCircle className="w-4 h-4 text-green-600" />
                                              Habilitado
                                            </>
                                          ) : (
                                            <>
                                              <XCircle className="w-4 h-4 text-red-600" />
                                              Deshabilitado
                                            </>
                                          )}
                                        </p>
                                      </>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                                    {editId === item.id ? (
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
                                          onClick={() => startEdit(item)}
                                          title="Editar"
                                          className="p-2.5 rounded transition-colors bg-amber-50 hover:bg-amber-100 dark:bg-amber-800/30 dark:hover:bg-amber-700/40 text-amber-600 dark:text-amber-200"
                                        >
                                          <Edit size={16} />
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleOpenModal(
                                              item.id,
                                              `${getNombreModalidad(
                                                item.modalidadId
                                              )} - ${getNombreEtapa(
                                                item.etapaId
                                              )}`
                                            )
                                          }
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

      <ConfirmDeleteModalidadEtapaModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmDelete}
        modalidadEtapaNombre={itemNombreSeleccionado}
      />
    </>
  );
}
