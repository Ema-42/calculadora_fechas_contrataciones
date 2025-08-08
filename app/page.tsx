"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import FormularioCalculo from "@/components/FormularioCalculo";
import ListadoRegistros from "@/components/ListadoRegistros";
import Toast from "@/components/Toast";
import Footer from "@/components/Footer";

export interface Registro {
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

export interface Feriado {
  id: number;
  fecha: string;
  nombre: string;
}

export interface Modalidad {
  id: number;
  nombre: string;
  publicacion: string;
  apertura: string;
  adjudicacion: string;
  presentacion: string;
  firma: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalRegistros: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export default function Home() {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [feriados, setFeriados] = useState<Feriado[]>([]);
  const [modalidades, setModalidades] = useState<Modalidad[]>([]);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Estados para paginación y búsqueda
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRegistros = async (page: number = 1, pageLimit: number = 5, search: string = "") => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pageLimit.toString(),
      });
      
      // Solo agregar parámetro search si no está vacío
      if (search.trim()) {
        params.append("search", search.trim());
      }
      
      const res = await fetch(`/api/contrataciones?${params}`);
      if (!res.ok) throw new Error("Error al cargar registros");
      
      const data = await res.json();
      setRegistros(data.data);
      setPaginationInfo(data.pagination);
    } catch (error: any) {
      console.error("Error al obtener registros:", error?.message || error);
      setToastMessage("Hubo un error al cargar los registros.");
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Efecto para cargar registros cuando cambian página o limit
  useEffect(() => {
    fetchRegistros(currentPage, limit, searchTerm);
  }, [currentPage, limit]);

  // Función para realizar búsqueda
  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setCurrentPage(1); // Resetear a página 1 al buscar
    fetchRegistros(1, limit, search);
  };

  // Función para limpiar búsqueda
  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
    fetchRegistros(1, limit, "");
  };

  // Función para cambiar página
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Función para cambiar límite de registros
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setCurrentPage(1); // Resetear a página 1 cuando cambia el límite
  };

  useEffect(() => {
    const fetchModalidades = async () => {
      try {
        const res = await fetch("/api/modalidades");
        if (!res.ok) throw new Error("Error al cargar modalidades");
        const data = await res.json();
        setModalidades(data);
      } catch (error: any) {
        console.error("Error al obtener modalidades:", error?.message || error);
        setToastMessage("Hubo un error al cargar las modalidades.");
        setShowToast(true);
      }
    };

    fetchModalidades();
  }, []);

  useEffect(() => {
    const fetchFeriados = async () => {
      try {
        const res = await fetch("/api/feriados");
        if (!res.ok) throw new Error("Error al cargar feriados");
        const data = await res.json();
        setFeriados(data);
      } catch (error: any) {
        console.error("Error al obtener feriados:", error?.message || error);
        setToastMessage("Hubo un error al cargar los feriados.");
        setShowToast(true);
      }
    };

    fetchFeriados();
  }, []);

  const esFeriado = (fecha: Date) => {
    const fechaStr = fecha.toISOString().split("T")[0];
    return feriados.some((feriado) => {
      const feriadoStr = new Date(feriado.fecha).toISOString().split("T")[0];
      return feriadoStr === fechaStr;
    });
  };

  const esFinDeSemana = (fecha: Date) => {
    const dia = fecha.getDay();
    return dia === 0 || dia === 6;
  };

  const esDiaHabil = (fecha: Date) => {
    esFeriado(fecha) && console.log(`Fecha ${fecha} es feriado`);
    return !esFinDeSemana(fecha) && !esFeriado(fecha);
  };

  const agregarDiasHabiles = (fechaInicio: Date, diasHabiles: number) => {
    const fecha = new Date(fechaInicio);
    let diasAgregados = 0;

    while (!esDiaHabil(fecha)) {
      fecha.setDate(fecha.getDate() + 1);
    }

    while (diasAgregados < diasHabiles) {
      fecha.setDate(fecha.getDate() + 1);
      if (esDiaHabil(fecha)) {
        diasAgregados++;
      }
    }

    return fecha.toISOString().split("T")[0];
  };

  const mostrarToast = (mensaje: string) => {
    setToastMessage(mensaje);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const agregarRegistro = async (datos: {
    titulo: string;
    fechaInicio: string;
    monto: number;
    modalidadId: any;
  }) => {
    const fechasCalculadas = calcularFechas(
      datos.fechaInicio,
      datos.modalidadId
    );

    const payload = {
      titulo: datos.titulo,
      fechaInicio: new Date(datos.fechaInicio).toISOString(),
      fechaGeneracion: new Date().toISOString(),
      modalidadId: datos.modalidadId,
      monto: datos.monto,
      fechaPublicacion: new Date(
        fechasCalculadas.fechaPublicacion
      ).toISOString(),
      fechaApertura: new Date(fechasCalculadas.fechaApertura).toISOString(),
      fechaAdjudicacion: new Date(
        fechasCalculadas.fechaAdjudicacion
      ).toISOString(),
      fechaPresentacionDocs: new Date(
        fechasCalculadas.fechaPresentacionDocs
      ).toISOString(),
      fechaFirmaContratos: new Date(
        fechasCalculadas.fechaFirmaContratos
      ).toISOString(),
    };

    try {
      const res = await fetch("/api/contrataciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al crear registro");

      const nuevo = await res.json();

      // Recargar registros después de agregar uno nuevo
      await fetchRegistros(currentPage, limit, searchTerm);
      mostrarToast("Registro creado exitosamente");
    } catch (error) {
      console.error("Error en agregarRegistro:", error);
      mostrarToast("Error al crear el registro");
    }
  };

  function parseFechaLocal(fechaStr: string): Date {
    const [year, month, day] = fechaStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  const calcularFechas = (fechaInicio: string, modalidadId: number) => {
    const fecha = parseFechaLocal(fechaInicio);
    const modalidad = modalidades.find(
      (m) => Number(m.id) === Number(modalidadId)
    );
    if (!modalidad) {
      throw new Error("Modalidad no encontrada para el ID: " + modalidadId);
    }

    const config = {
      publicacion: Number(modalidad.publicacion),
      apertura: Number(modalidad.apertura),
      adjudicacion: Number(modalidad.adjudicacion),
      presentacion: Number(modalidad.presentacion),
      firma: Number(modalidad.firma),
    };

    return {
      fechaPublicacion: agregarDiasHabiles(fecha, config.publicacion),
      fechaApertura: agregarDiasHabiles(fecha, config.apertura),
      fechaAdjudicacion: agregarDiasHabiles(fecha, config.adjudicacion),
      fechaPresentacionDocs: agregarDiasHabiles(fecha, config.presentacion),
      fechaFirmaContratos: agregarDiasHabiles(fecha, config.firma),
    };
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-6 space-y-8">
        <FormularioCalculo
          onSubmit={agregarRegistro}
          modalidades={modalidades}
        />
        <ListadoRegistros 
          registros={registros} 
          loading={isLoading}
          paginationInfo={paginationInfo}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          onSearch={handleSearch}
          onClearSearch={handleClearSearch}
          searchTerm={searchTerm}
        />
      </main>
      {showToast && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
      )}
      <Footer />
    </div>
  );
}