"use client";

import type React from "react";

import { useState, useMemo } from "react";
import { Search, FileText } from "lucide-react";
import TablaRegistros from "./TablaRegistros";
import Paginacion from "./Paginacion";
import ModalImprimirTodos from "./ModalImprimirTodos";
import LoadingSpinner from "./LoadingSpinner";

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

interface ListadoRegistrosProps {
  registros: Registro[];
  loading: boolean;
}

export default function ListadoRegistros({
  registros,
  loading,
}: ListadoRegistrosProps) {
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [mostrarModalPDF, setMostrarModalPDF] = useState(false);
  const [registrosPorPagina, setRegistrosPorPagina] = useState<number | "all">(
    5
  ); // Estado para registros por página

  const registrosFiltrados = useMemo(() => {
    if (!busqueda) return registros;

    return registros.filter(
      (registro) =>
        registro.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        registro.modalidad.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [registros, busqueda]);

  const totalPaginas =
    registrosPorPagina === "all"
      ? 1
      : Math.ceil(registrosFiltrados.length / registrosPorPagina);
  const indiceInicio =
    (paginaActual - 1) *
    (typeof registrosPorPagina === "number" ? registrosPorPagina : 0);
  const registrosPaginados =
    registrosPorPagina === "all"
      ? registrosFiltrados
      : registrosFiltrados.slice(
          indiceInicio,
          indiceInicio + registrosPorPagina
        );

  // Resetear página cuando cambie la búsqueda o el número de registros por página
  const handleBusquedaChange = (valor: string) => {
    setBusqueda(valor);
    setPaginaActual(1);
  };

  const handleRegistrosPorPaginaChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setRegistrosPorPagina(value === "all" ? "all" : Number(value));
    setPaginaActual(1); // Resetear a la primera página al cambiar la paginación
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        {/* Eliminado el h2 "Registros de Contratación" */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4 sm:mb-0">
          Registros ({registrosFiltrados.length})
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Buscar por título o modalidad..."
              value={busqueda}
              onChange={(e) => handleBusquedaChange(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent w-full"
            />
          </div>
          <button
            onClick={() => setMostrarModalPDF(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center w-full sm:w-auto"
          >
            <FileText className="mr-2" size={16} />
            Reporte PDF
          </button>
          <select
            value={registrosPorPagina}
            onChange={handleRegistrosPorPaginaChange}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent w-full sm:w-auto"
          >
            <option value={5}>Mostrar 5</option>
            <option value={10}>Mostrar 10</option>
            <option value="all">Mostrar Todos</option>
          </select>
        </div>
      </div>

      {loading && registros.length === 0 ? (
        <LoadingSpinner mensaje="Cargando registros..." /> 
      ) : registrosFiltrados.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {busqueda
              ? "No se encontraron registros que coincidan con la búsqueda"
              : "No hay registros aún"}
          </p>
        </div>
      ) : (
        <>
          <TablaRegistros registros={registrosPaginados} />
          {totalPaginas > 1 && registrosPorPagina !== "all" && (
            <Paginacion
              paginaActual={paginaActual}
              totalPaginas={totalPaginas}
              onCambioPagina={setPaginaActual}
            />
          )}
        </>
      )}

      {mostrarModalPDF && (
        <ModalImprimirTodos
          registros={registros}
          onClose={() => setMostrarModalPDF(false)}
        />
      )}
    </div>
  );
}

