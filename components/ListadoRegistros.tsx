"use client";

import type React from "react";
import { useState, useMemo, useEffect } from "react";
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
  fechaPresentacion: string;
  fechaApertura: string;
  fechaAdjudicacion: string;
  fechaPresentacionDocs: string;
  fechaFirmaContratos: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalRegistros: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

interface ListadoRegistrosProps {
  registros: Registro[];
  loading: boolean;
  paginationInfo: PaginationInfo | null;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  onSearch: (search: string) => void;
  onClearSearch: () => void;
  searchTerm: string;
}

export default function ListadoRegistros({
  registros,
  loading,
  paginationInfo,
  onPageChange,
  onLimitChange,
  onSearch,
  onClearSearch,
  searchTerm,
}: ListadoRegistrosProps) {
  const [busqueda, setBusqueda] = useState("");
  const [mostrarModalPDF, setMostrarModalPDF] = useState(false);

  // Sincronizar búsqueda local con el término de búsqueda global
  useEffect(() => {
    setBusqueda(searchTerm);
  }, [searchTerm]);

  const handleBusquedaChange = (valor: string) => {
    setBusqueda(valor);
    // Si se vacía el input, limpiar la búsqueda automáticamente
    if (!valor.trim()) {
      onClearSearch();
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (busqueda.trim()) {
        onSearch(busqueda);
      } else {
        onClearSearch();
      }
    }, 500); // espera 500ms después de que el usuario deja de escribir

    return () => clearTimeout(delayDebounce);
  }, [busqueda]);

  const handleBuscar = () => {
    onSearch(busqueda);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBuscar();
    }
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value);
    onLimitChange(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row sm:items-center sm:justify-between mb-6">
        <div className="mb-4 sm:mb-0">
          {paginationInfo && (
            <p className="text-sm text-gray-500 mt-1 mb-1">
              Página {paginationInfo.currentPage} de {paginationInfo.totalPages}
            </p>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              onKeyDown={handleKeyPress}
              placeholder="Buscar por título, modalidad o ID"
              value={busqueda}
              onChange={(e) => handleBusquedaChange(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent w-full"
            />
          </div>
          <select
            value={paginationInfo?.limit || 5}
            onChange={handleLimitChange}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent w-full sm:w-auto"
          >
            <option value={5}>Mostrar 5</option>
            <option value={10}>Mostrar 10</option>
            <option value={25}>Mostrar 25</option>
            <option value={50}>Mostrar 50</option>
          </select>{" "}
          <button
            onClick={() => setMostrarModalPDF(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center w-full sm:w-auto"
          >
            <FileText className="mr-2" size={16} />
            Reporte
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner mensaje="Cargando registros..." />
      ) : registros.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {searchTerm
              ? `No se encontraron registros que coincidan con "${searchTerm}"`
              : "No hay registros aún"}
          </p>
          {searchTerm && (
            <button
              onClick={onClearSearch}
              className="mt-4 text-sky-600 hover:text-sky-700 underline"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      ) : (
        <>
          <TablaRegistros registros={registros} />

          {paginationInfo && paginationInfo.totalPages > 1 && (
            <div className="mt-6">
              <Paginacion
                paginaActual={paginationInfo.currentPage}
                totalPaginas={paginationInfo.totalPages}
                onCambioPagina={onPageChange}
              />
              <div className="text-center mt-4 text-sm text-gray-600">
                Mostrando{" "}
                {Math.min(
                  (paginationInfo.currentPage - 1) * paginationInfo.limit + 1,
                  paginationInfo.totalRegistros
                )}{" "}
                -{" "}
                {Math.min(
                  paginationInfo.currentPage * paginationInfo.limit,
                  paginationInfo.totalRegistros
                )}{" "}
                de {paginationInfo.totalRegistros} registros
              </div>
            </div>
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

