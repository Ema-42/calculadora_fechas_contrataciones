"use client";

import type React from "react";

import {
  Calendar,
  CalendarClock,
  CalendarCheck,
  Download,
  DollarSign,
} from "lucide-react"; // Importar Download
import { useState } from "react";
import { generateSingleRecordPdf } from "@/lib/pdf-utils"; // Importar la utilidad de PDF

interface Registro {
  id: number;
  fechaGeneracion: string;
  titulo: string;
  fechaInicio: string;
  modalidad: { id: number; nombre: string };
  monto: number;
  fechaPublicacion: string;
  fechaApertura: string;
  fechaAdjudicacion: string;
  fechaPresentacionDocs: string;
  fechaFirmaContratos: string;
}

interface TablaRegistrosProps {
  registros: Registro[];
}

export default function TablaRegistros({ registros }: TablaRegistrosProps) {
  const [filaSeleccionada, setFilaSeleccionada] = useState<number | null>(null);

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

  const formatearFechaSimple = (fecha: string) => {
    // Eliminar la "Z" para evitar conversión de zona horaria
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

  return (
    <div className="grid grid-cols-1 gap-4">
      {registros.length === 0 ? (
        <div className="col-span-1 text-center py-8 text-gray-500">
          No hay registros para mostrar.
        </div>
      ) : (
        registros.map((registro) => (
          <div
            key={registro.id}
            className={`bg-gray-50 rounded-lg shadow-md cursor-pointer transition-all duration-200 ease-in-out 
              ${
                filaSeleccionada === registro.id
                  ? "bg-gray-100 border-l-4 border-gray-500"
                  : "hover:bg-gray-100"
              }`}
            onClick={() =>
              setFilaSeleccionada(
                filaSeleccionada === registro.id ? null : registro.id
              )
            }
          >
            {/* Sección de Encabezado de la Tarjeta */}
            <div className="bg-gray-200  pt-4 rounded-t-lg mb-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-700 pl-4">
                  ID: #{registro.id}
                </span>
                <div className="flex items-center text-sm text-gray-700">
                  <CalendarClock className="mr-1 text-gray-500" size={14} />
                  <span className="pr-4">
                    {formatearFecha(registro.fechaGeneracion, true)}
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 uppercase text-center mb-2">
                {registro.titulo || "Sin Título"}
              </h3>
              <div className="w-full text-center">
                <span className="inline-block text-sm py-1  font-semibold bg-blue-700/20 text-blue-950 w-full">
                  MODALIDAD: {registro.modalidad.nombre}
                </span>
              </div>
            </div>

            {/* Sección de Contenido de la Tarjeta */}
            <div className="p-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700 mb-3">
                <div className="flex items-center">
                  <Calendar className="mr-2 text-gray-500" size={16} />
                  <p>
                    <strong className="text-gray-800">Fecha de Inicio:</strong>{" "}
                    <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                      {formatearFechaSimple(registro.fechaInicio)}
                    </span>
                  </p>
                </div>
                <div className="flex items-center">
                  <DollarSign className="mr-2 text-gray-500" size={16} />
                  <p>
                    <strong className="text-gray-800">Monto:</strong>{" "}
                    <span className="ml-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold">
                      {formatearMonto(registro.monto)} BS.
                    </span>
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3 mt-3">
                <h4 className="font-semibold text-gray-800 mb-2">Fechas:</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-700">
                  <li className="flex items-center">
                    <CalendarCheck className="mr-2 text-gray-500" size={16} />
                    <strong className="text-gray-800">Publicación:</strong>
                    <span className="ml-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      {formatearFechaSimple(registro.fechaPublicacion)}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CalendarCheck className="mr-2 text-gray-500" size={16} />
                    <strong className="text-gray-800">Apertura:</strong>{" "}
                    <span className="ml-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      {formatearFechaSimple(registro.fechaApertura)}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CalendarCheck className="mr-2 text-gray-500" size={16} />
                    <strong className="text-gray-800">
                      Adjudicación:
                    </strong>{" "}
                    <span className="ml-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      {formatearFechaSimple(registro.fechaAdjudicacion)}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CalendarCheck className="mr-2 text-gray-500" size={16} />
                    <strong className="text-gray-800">
                      Presentación Docs:
                    </strong>{" "}
                    <span className="ml-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      {formatearFechaSimple(registro.fechaPresentacionDocs)}
                    </span>
                  </li>
                  <li className="flex items-center">
                    <CalendarCheck className="mr-2 text-gray-500" size={16} />
                    <strong className="text-gray-800">
                      Firma Contrato:
                    </strong>{" "}
                    <span className="ml-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                      {formatearFechaSimple(registro.fechaFirmaContratos)}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-4 flex justify-center">
                <button
                  onClick={(e) => handleDownloadSingle(registro, e)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors flex items-center w-full justify-center"
                  title="Descargar PDF"
                >
                  <Download size={16} className="mr-2" />
                  Descargar PDF
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

