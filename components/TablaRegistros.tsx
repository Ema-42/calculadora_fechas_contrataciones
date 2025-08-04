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
                <span className="inline-block text-sm py-1 font-semibold bg-gray-400 text-gray-00 w-full">
                  {registro.modalidad.nombre}
                </span>
              </div>
            </div>

            {/* Sección de Contenido de la Tarjeta */}
            <div className="p-4 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700 mb-3">
                <div className="flex items-center">
                  <Calendar className="mr-2 text-gray-500" size={16} />
                  <p>
                    <strong className="text-gray-800">F. Inicio:</strong>{" "}
                    {formatearFecha(registro.fechaInicio)}
                  </p>
                </div>
                <div className="flex items-center">
                  <DollarSign className="mr-2 text-gray-500" size={16} />
                  <p>
                    <strong className="text-gray-800">Monto:</strong>{" "}
                    {formatearMonto(registro.monto)}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3 mt-3">
                <h4 className="font-semibold text-gray-800 mb-2">Fechas:</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-700">
                  <li className="flex items-center">
                    <CalendarCheck className="mr-2 text-gray-500" size={16} />
                    <strong className="text-gray-800">Publicación:</strong>{" "}
                    {formatearFecha(registro.fechaPublicacion)}
                  </li>
                  <li className="flex items-center">
                    <CalendarCheck className="mr-2 text-gray-500" size={16} />
                    <strong className="text-gray-800">Apertura:</strong>{" "}
                    {formatearFecha(registro.fechaApertura)}
                  </li>
                  <li className="flex items-center">
                    <CalendarCheck className="mr-2 text-gray-500" size={16} />
                    <strong className="text-gray-800">
                      Adjudicación:
                    </strong>{" "}
                    {formatearFecha(registro.fechaAdjudicacion)}
                  </li>
                  <li className="flex items-center">
                    <CalendarCheck className="mr-2 text-gray-500" size={16} />
                    <strong className="text-gray-800">
                      Presentación Docs:
                    </strong>{" "}
                    {formatearFecha(registro.fechaPresentacionDocs)}
                  </li>
                  <li className="flex items-center">
                    <CalendarCheck className="mr-2 text-gray-500" size={16} />
                    <strong className="text-gray-800">
                      Firma Contratos:
                    </strong>{" "}
                    {formatearFecha(registro.fechaFirmaContratos)}
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

