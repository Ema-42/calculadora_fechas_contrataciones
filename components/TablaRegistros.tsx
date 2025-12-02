"use client";

import type React from "react";

import {
  Calendar,
  CalendarClock,
  CalendarCheck,
  Download,
  DollarSign,
  Share2,
  Copy,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { generateSingleRecordPdf } from "@/lib/pdf-utils";
import { Registro } from "@/app/interfaces/interfaces";
import ConfirmDeleteContratacionModal from "./ConfirmDeleteContratacionModal ";
import { auth } from "@/app/firebase/config";

interface TablaRegistrosProps {
  registros: Registro[];
  onEliminar: (id: number) => void;
}

export default function TablaRegistros({
  registros,
  onEliminar,
}: TablaRegistrosProps) {
  const [filaSeleccionada, setFilaSeleccionada] = useState<number | null>(null);
  const [copiada, setCopiada] = useState(false);
  const [itemNombreSeleccionado, setItemNombreSeleccionado] = useState<
    string | null
  >(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [itemSeleccionado, setItemSeleccionado] = useState<number | null>(null);
  const formatearFecha = (fecha: string, includeTime = false) => {
    const fechaObj = new Date(fecha);
    if (includeTime) {
      return fechaObj.toLocaleString("es-ES", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    }
    return fechaObj.toLocaleDateString("es-ES");
  };

  const handleOpenModal = (id: number, nombre: string) => {
    setItemSeleccionado(id);
    setItemNombreSeleccionado(nombre);
    setModalOpen(true);
  };

  const formatearFechaSimple = (fecha?: string) => {
    if (!fecha) return ""; // o "—" según quieras mostrar

    const fechaSinZ = fecha.replace(/Z$/, "");
    const fechaObj = new Date(fechaSinZ);

    return fechaObj.toLocaleDateString("es-BO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatearMonto = (monto: number) => {
    return new Intl.NumberFormat("en", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: false,
    }).format(monto);
  };

  const handleDownloadSingle = (
    registro: Registro,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    generateSingleRecordPdf(registro, "download");
  };

  const formatearRegistroComoTexto = (registro: any): string => {
    let texto = `
📄 *Título:* ${registro.titulo}
💰 *Monto:* Bs. ${registro.monto.toFixed(2)}
📅 *Fecha de generación:* ${formatearFecha(registro.fechaGeneracion, true)}
🛠️ *Modalidad:* ${registro.modalidad?.nombre || "N/A"}

📌 *Fechas importantes:*
📅 Fecha de Inicio: ${formatearFechaSimple(registro.fechaInicio)}
`;

    // Agregar dinámicamente las etapas que existan
    if (registro.etapas && Object.keys(registro.etapas).length > 0) {
      Object.entries(registro.etapas).forEach(([nombreEtapa, fecha]) => {
        texto += `📍 ${nombreEtapa}: ${formatearFechaSimple(
          fecha as string
        )}\n`;
      });
    }

    return texto.trim();
  };

  const handleCopyToClipboard = async (data: object) => {
    try {
      const texto = formatearRegistroComoTexto(data);
      await navigator.clipboard.writeText(texto);
      setCopiada(true);
      setTimeout(() => setCopiada(false), 3000);
    } catch (error) {
      console.error("Error al copiar al portapapeles:", error);
    }
  };

  const handleShare = async (data: object) => {
    const texto = formatearRegistroComoTexto(data);
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Compartir información",
          text: texto,
        });
      } catch (error) {}
    } else {
      alert("La función de compartir no está disponible en este navegador");
    }
  };

  const handleConfirmDelete = () => {
    if (itemSeleccionado !== null) onEliminar(itemSeleccionado);
    setModalOpen(false);
    setItemSeleccionado(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        {registros.length === 0 ? (
          <div className="col-span-1 text-center py-8 text-gray-500 dark:text-gray-400">
            No hay registros para mostrar.
          </div>
        ) : (
          registros.map((registro) => (
            <div
              key={registro.id}
              className={`bg-gray-50 dark:bg-[hsl(217,26%,16%)] rounded-lg shadow-md dark:shadow-gray-900/50 cursor-pointer transition-all duration-200 ease-in-out 
              ${
                filaSeleccionada === registro.id
                  ? "bg-white dark:bg-[hsl(217,26%,18%)] border-l-4 border-r-4 border-sky-600 dark:border-sky-500"
                  : "hover:bg-gray-100 dark:hover:bg-[hsl(217,26%,18%)]"
              }`}
              onClick={() =>
                setFilaSeleccionada(
                  filaSeleccionada === registro.id ? null : registro.id
                )
              }
            >
              <div className="bg-blue-700/10 dark:bg-blue-900/20 pt-4 rounded-t-lg mb-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 pl-4">
                    ID: #{registro.id}
                  </span>
                  <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <CalendarClock
                      className="mr-1 text-gray-500 dark:text-gray-400"
                      size={14}
                    />
                    <span className="pr-4">
                      {formatearFecha(registro.fechaGeneracion, true)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-center md:justify-end">
                  <span className=" md:mr-3 px-3 py-0.5 bg-blue-100 dark:bg-blue-900/40 border border-blue-400 dark:border-blue-700 text-blue-800 dark:text-blue-200 rounded-full text-sm inline-flex items-center">
                    {registro?.usuarioCreacion || "Desconocido"}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 uppercase text-center  ">
                  {registro.titulo || "Sin Título"}
                </h3>
                <div className="w-full">
                  <div className="flex items-center justify-between w-full bg-blue-700/20 dark:bg-blue-900/30 text-blue-950 dark:text-blue-200">
                    <span className="flex-1 text-center text-sm py-1 font-normal ">
                      MODALIDAD: {registro.modalidad.nombre}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700 dark:text-gray-300 mb-3">
                  <div className="flex items-center">
                    <Calendar
                      className="mr-2 text-gray-500 dark:text-gray-400"
                      size={16}
                    />
                    <p>
                      <strong className="text-gray-800 dark:text-gray-200">
                        Fecha de Inicio:
                      </strong>{" "}
                      <span className="ml-2 px-3 py-0.5 bg-blue-100 dark:bg-blue-900/40 border border-blue-400 dark:border-blue-700 text-blue-800 dark:text-blue-200 rounded-full text-sm font-semibold">
                        {formatearFechaSimple(registro.fechaInicio)}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center">
                    <DollarSign
                      className="mr-2 text-gray-500 dark:text-gray-400"
                      size={16}
                    />
                    <p>
                      <strong className="text-gray-800 dark:text-gray-200">
                        Monto:
                      </strong>{" "}
                      <span className="ml-2 px-3 py-0.5 bg-amber-100 dark:bg-amber-900/40 border border-amber-400 dark:border-amber-700 text-amber-800 dark:text-amber-200 rounded-full text-sm font-semibold">
                        {formatearMonto(registro.monto)} BS.
                      </span>
                    </p>
                  </div>
                </div>

                {/* Renderizado dinámico de etapas */}
                {registro.etapas && Object.keys(registro.etapas).length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-700 dark:text-gray-300">
                      {Object.entries(registro.etapas).map(
                        ([nombreEtapa, fecha]) => (
                          <li key={nombreEtapa} className="flex items-center">
                            <CalendarCheck
                              className="mr-2 text-gray-500 dark:text-gray-400"
                              size={16}
                            />
                            <strong className="text-gray-800 dark:text-gray-200">
                              {nombreEtapa}:
                            </strong>{" "}
                            <span className="ml-2 px-3 py-0.5 bg-green-100 dark:bg-green-900/40 border border-green-400 dark:border-green-700 text-green-800 dark:text-green-200 rounded-full text-sm font-semibold">
                              {formatearFechaSimple(fecha as string)}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                <div className="mt-4 flex flex-col sm:flex-row justify-center items-center w-full sm:gap-3">
                  <div className="flex w-full sm:w-auto rounded-lg overflow-hidden shadow-md">
                    {/* PDF */}
                    <button
                      onClick={(e) => handleDownloadSingle(registro, e)}
                      className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800
                 text-white px-2 sm:px-3 py-2 text-sm font-medium transition-colors
                 flex items-center justify-center gap-2 w-full sm:w-auto"
                      title="Descargar PDF"
                    >
                      <Download size={16} />
                      <span>PDF</span>
                    </button>

                    {/* Compartir */}
                    <button
                      onClick={() => handleShare(registro)}
                      className="bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-700 dark:hover:bg-cyan-800
                 text-white px-2 sm:px-3 py-2 text-sm font-medium transition-colors
                 flex items-center justify-center gap-2 w-full sm:w-auto"
                      title="Compartir"
                    >
                      <Share2 size={16} />
                      <span>Compartir</span>
                    </button>

                    {/* Copiar */}
                    <button
                      onClick={() => handleCopyToClipboard(registro)}
                      className="bg-slate-600 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-800
                 text-white px-2 sm:px-3 py-2 text-sm font-medium transition-colors
                 flex items-center justify-center gap-2 w-full sm:w-auto"
                      title="Copiar"
                    >
                      <Copy size={16} />
                      {copiada ? (
                        <span className="font-semibold">Copiado ✓</span>
                      ) : (
                        "Copiar"
                      )}  
                    </button>

                    {/* Eliminar (solo si corresponde) */}
                    {auth.currentUser?.email === registro.usuarioCreacion && (
                      <button
                        onClick={() => (
                          setItemNombreSeleccionado(registro.titulo),
                          handleOpenModal(registro.id, registro.titulo)
                        )}
                        className="bg-gray-800 hover:bg-gray-900 dark:bg-gray-900 dark:hover:bg-black
                   text-white px-2 sm:px-3 py-2 text-sm font-medium transition-colors
                   flex items-center justify-center gap-2 w-full sm:w-auto"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <ConfirmDeleteContratacionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmDelete}
        contratacionNombre={itemNombreSeleccionado}
      />
    </>
  );
}

