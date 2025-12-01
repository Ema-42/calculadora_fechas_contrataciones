"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import FormularioCalculo from "@/components/FormularioCalculo";
import ListadoRegistros from "@/components/ListadoRegistros";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import GestorFeriados from "@/components/GestorFeriados";

import axios from "axios";
import FullScreenLoader from "@/components/FullScreenLoader";
import {
  Etapa,
  Feriado,
  Modalidad,
  PaginationInfo,
  Registro,
} from "../interfaces/interfaces";
import GestionarEtapas from "@/components/GestionarEtapas";
import { showToast } from "nextjs-toast-notify";
import GestionarModalidadesEtapas, {
  ModalidadEtapa,
} from "@/components/GestionarModalidadesEtapas";
import GestionarModalidades from "@/components/GestionarModalidades";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [feriados, setFeriados] = useState<Feriado[]>([]);
  const [etapas, setEtapas] = useState<Etapa[]>([]);
  const [modalidades, setModalidades] = useState<Modalidad[]>([]);
  const [modalidadesEtapas, setModalidadesEtapas] = useState<ModalidadEtapa[]>(
    []
  );
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo | null>(
    null
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSaveContratacion, setIsLoadingSaveContratacion] =
    useState(false);

  // Estados para paginación y búsqueda
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const verificarToken = async () => {
      try {
        const res = await axios.get("/api/auth/verify-token");
        if (!res.data.ok) {
          router.push("/login");
        }
      } catch (error) {
        router.push("/login");
      }
    };

    verificarToken();
  }, [router]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  const fetchRegistros = async (
    page: number = 1,
    pageLimit: number = 5,
    search: string = "",
    saving: boolean = false
  ) => {
    if (saving) {
      setIsLoading(true);
    }
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
      //console.error("Error al obtener registros:", error?.message || error);
      //notifyError("Hubo un error al cargar los registros.");
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

  const fetchModalidades = async () => {
    try {
      const res = await fetch("/api/modalidades");
      if (!res.ok) throw new Error("Error al cargar modalidades");
      const data = await res.json();
      setModalidades(data);
    } catch (error: any) {
      //console.error("Error al obtener modalidades:", error?.message || error);
      //notifyError("Hubo un error al cargar las modalidades.");
    }
  };

  const fetchFeriados = async () => {
    try {
      const res = await fetch("/api/feriados");
      if (!res.ok) throw new Error("Error al cargar feriados");
      const data = await res.json();
      setFeriados(data);
    } catch (error: any) {
      //console.error("Error al obtener feriados:", error?.message || error);
      //notifyError("Hubo un error al cargar los feriados.");
    }
  };

  const fetchEtapasTest = async () => {
    try {
      const res = await fetch("/api/etapas");
      if (!res.ok) throw new Error(`Error al cargar etapas: ${res.status}`);
      const data: Etapa[] = await res.json();
      setEtapas(data); // guarda en la variable de estado
    } catch (error) {
      console.error("Error en fetchEtapasTest:", error);
    }
  };

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
    esFeriado(fecha);
    return !esFinDeSemana(fecha) && !esFeriado(fecha);
  };

  const agregarDiasHabiles = (fechaInicio: Date, diasHabiles: number) => {
    const fecha = new Date(fechaInicio);
    fecha.setDate(fecha.getDate() + 1); // Comenzamos desde el día siguiente

    let diasAgregados = 0;

    // Avanzamos hasta encontrar el primer día hábil
    while (!esDiaHabil(fecha)) {
      fecha.setDate(fecha.getDate() + 1);
    }

    // Contamos los días hábiles
    while (diasAgregados < diasHabiles) {
      // Quitamos el -1
      if (esDiaHabil(fecha)) {
        diasAgregados++;
        if (diasAgregados < diasHabiles) {
          // Solo avanzamos si no hemos llegado al total
          fecha.setDate(fecha.getDate() + 1);
        }
      } else {
        fecha.setDate(fecha.getDate() + 1);
      }
    }

    return fecha.toISOString().split("T")[0];
  };

  const agregarRegistro = async (datos: {
    titulo: string;
    fechaInicio: string;
    monto?: number;
    modalidadId: any;
    saving?: boolean;
  }) => {

    // Filtra modalidadesEtapas por el modalidadId de datos
    const modalidadesEtapaFiltrado = modalidadesEtapas.filter(
      (me) => me.modalidad?.id === datos.modalidadId
    );

    setIsLoadingSaveContratacion(true);


    const fechasCalculadas = calcularFechas(
      datos.fechaInicio,
      modalidadesEtapaFiltrado
    );

    const payload = {
      titulo: datos.titulo,
      fechaInicio: new Date(datos.fechaInicio).toISOString(),
      fechaGeneracion: new Date().toISOString(),
      modalidadId: datos.modalidadId,
      monto: datos.monto,
      usuarioCreacion: user?.email || "desconocido",
      etapas: fechasCalculadas,
    };

    try {
      const res = await fetch("/api/contrataciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al crear registro");

      await fetchRegistros(currentPage, limit, searchTerm);
      notifySuccess("Registro creado exitosamente");
    } catch (error) {
      console.error("Error en agregarRegistro:", error);
      notifyError("Error al crear el registro");
    } finally {
      setIsLoadingSaveContratacion(false);
    }
  };

  function parseFechaLocal(fechaStr: string): Date {
    const [year, month, day] = fechaStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  const calcularFechas = (
    fechaInicio: string,
    modalidadesEtapaFiltrado: ModalidadEtapa[]
  ): Record<string, string> => {
    const fecha = parseFechaLocal(fechaInicio);
    const fechasCalculadas: Record<string, string> = {};

    modalidadesEtapaFiltrado.forEach((me) => {
      if (me.etapa && me.etapa.nombre) {
        const fechaCalculada = agregarDiasHabiles(fecha, Number(me.cantidad));
        // Convertir a ISO string con Z
        fechasCalculadas[me.etapa.nombre] = new Date(
          fechaCalculada
        ).toISOString();
      }
    });

    return fechasCalculadas;
  };

  const fetchModalidadesEtapas = async () => {
    try {
      const res = await fetch("/api/modalidades-etapas");
      if (!res.ok)
        throw new Error(`Error al cargar modalidades-etapas: ${res.status}`);
      const data: ModalidadEtapa[] = await res.json();
      setModalidadesEtapas(data); // guarda en la variable de estado
    } catch (error) {
      console.error("Error en fetchModalidadesEtapas:", error);
    }
  };

  useEffect(() => {
    fetchEtapasTest();
    fetchFeriados();
    fetchModalidades();
    fetchModalidadesEtapas();
  }, []);
  if (loading) {
    return <FullScreenLoader />;
  }

  if (!user) {
    return null;
  }

  const agregarFeriado = async (nuevaFecha: string, nuevoNombre: string) => {
    const res = await fetch("/api/feriados", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fecha: nuevaFecha, nombre: nuevoNombre }),
    });

    if (!res.ok) {
      console.error("Error al agregar feriado:", res.statusText);
      return;
    }
    notifySuccess("¡Feriado agregado exitosamente!");

    const nuevoFeriado = await res.json();
    setFeriados((prev) => [...prev, nuevoFeriado]);
  };

  const editarFeriado = async (
    id: number,
    nuevaFecha: string,
    nuevoNombre: string
  ) => {
    try {
      const res = await fetch(`/api/feriados/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fecha: nuevaFecha, nombre: nuevoNombre }),
      });

      if (!res.ok) {
        console.error("Error al editar feriado:", res.statusText);
        notifyError("Error al editar feriado");
        return;
      }

      const feriadoActualizado = await res.json();
      setFeriados((prev) =>
        prev.map((f) => (f.id === id ? feriadoActualizado : f))
      );
      notifySuccess("¡Feriado editado exitosamente!");
    } catch (error) {
      console.error("Error en editarFeriado:", error);
      notifyError("Error al editar feriado");
    }
  };

  const eliminarFeriado = async (id: number) => {
    const res = await fetch(`/api/feriados/${id}`, {
      // ← Cambio aquí: agregar /${id}
      method: "DELETE",
      // ← Eliminar body y headers ya que no los necesitas
    });

    if (!res.ok) {
      notifyError("Error al eliminar feriado");
      return;
    }
    notifySuccess("¡Feriado eliminado exitosamente!");

    setFeriados((prev) => prev.filter((f) => f.id !== id));
  };

  const agregarEtapa = async (nombre: string) => {
    try {
      const res = await fetch("/api/etapas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre }),
      });

      if (!res.ok) {
        notifyError("Error al agregar etapa");
        return;
      }

      notifySuccess("¡Etapa agregada exitosamente!");
      const nuevaEtapa = await res.json();
      setEtapas((prev) => [...prev, nuevaEtapa]);
    } catch (error) {
      console.error("Error al agregar etapa:", error);
      notifyError("Error al agregar etapa");
    }
  };

  const eliminarEtapa = async (id: number) => {
    try {
      const res = await fetch(`/api/etapas/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Error al eliminar etapa:", res.statusText);
        notifyError("Error al eliminar etapa");
        return;
      }
      fetchModalidadesEtapas();
      notifySuccess("¡Etapa eliminada exitosamente!");
      setEtapas((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      console.error("Error al eliminar etapa:", error);
      notifyError("Error al eliminar etapa");
    }
  };

  const editarEtapa = async (id: number, nombre: string) => {
    try {
      const res = await fetch(`/api/etapas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre }),
      });

      if (!res.ok) {
        console.error("Error al editar etapa:", res.statusText);
        notifyError("Error al editar etapa");
        return;
      }
      fetchModalidadesEtapas();
      notifySuccess("¡Etapa editada exitosamente!");
      const etapaActualizada = await res.json();
      setEtapas((prev) =>
        prev.map((e) => (e.id === id ? etapaActualizada : e))
      );
    } catch (error) {
      console.error("Error al editar etapa:", error);
      notifyError("Error al editar etapa");
    }
  };

  const obtenerEtapa = async (id: number): Promise<Etapa | null> => {
    try {
      const res = await fetch(`/api/etapas/${id}`);
      if (!res.ok) {
        console.error("Error al obtener etapa:", res.statusText);
        return null;
      }
      const data: Etapa = await res.json();
      return data;
    } catch (error) {
      console.error("Error al obtener etapa:", error);
      return null;
    }
  };

  const agregarModalidadEtapa = async (
    modalidadId: number,
    etapaId: number,
    cantidad: string,
    habilitado: boolean
  ) => {
    try {
      const res = await fetch("/api/modalidades-etapas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modalidadId,
          etapaId,
          cantidad,
          habilitado,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error al agregar modalidad-etapa:", errorData);
        notifyError(errorData.error || "Error al agregar modalidad-etapa");
        return;
      }

      notifySuccess("¡Modalidad-Etapa agregada exitosamente!");
      const nuevaModalidadEtapa = await res.json();
      setModalidadesEtapas((prev) => [...prev, nuevaModalidadEtapa]);
    } catch (error) {
      console.error("Error al agregar modalidad-etapa:", error);
      notifyError("Error al agregar modalidad-etapa");
    }
  };

  const eliminarModalidadEtapa = async (id: number) => {
    try {
      const res = await fetch(`/api/modalidades-etapas/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error al eliminar modalidad-etapa:", errorData);
        notifyError(errorData.error || "Error al eliminar modalidad-etapa");
        return;
      }

      notifySuccess("¡Modalidad-Etapa eliminada exitosamente!");
      setModalidadesEtapas((prev) => prev.filter((me) => me.id !== id));
    } catch (error) {
      console.error("Error al eliminar modalidad-etapa:", error);
      notifyError("Error al eliminar modalidad-etapa");
    }
  };

  const editarModalidadEtapa = async (
    id: number,
    etapaId: number,
    cantidad: string,
    habilitado: boolean
  ) => {
    try {
      const res = await fetch(`/api/modalidades-etapas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          etapaId,
          cantidad,
          habilitado,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error al editar modalidad-etapa:", errorData);
        notifyError(errorData.error || "Error al editar modalidad-etapa");
        return;
      }

      notifySuccess("¡Modalidad-Etapa editada exitosamente!");
      const modalidadEtapaActualizada = await res.json();
      setModalidadesEtapas((prev) =>
        prev.map((me) => (me.id === id ? modalidadEtapaActualizada : me))
      );
    } catch (error) {
      console.error("Error al editar modalidad-etapa:", error);
      notifyError("Error al editar modalidad-etapa");
    }
  };

  const agregarModalidad = async (nombre: string) => {
    try {
      const res = await fetch("/api/modalidades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error al agregar modalidad:", errorData);
        notifyError(errorData.error || "Error al agregar modalidad");
        return;
      }

      notifySuccess("¡Modalidad agregada exitosamente!");
      const nuevaModalidad = await res.json();
      setModalidades((prev) => [...prev, nuevaModalidad]);
    } catch (error) {
      console.error("Error al agregar modalidad:", error);
      notifyError("Error al agregar modalidad");
    }
  };

  const eliminarModalidad = async (id: number) => {
    try {
      const res = await fetch(`/api/modalidades/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error al eliminar modalidad:", errorData);
        notifyError(errorData.error || "Error al eliminar modalidad");
        return;
      }
      fetchModalidadesEtapas();
      notifySuccess("¡Modalidad eliminada exitosamente!");
      setModalidades((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error("Error al eliminar modalidad:", error);
      notifyError("Error al eliminar modalidad");
    }
  };

  const editarModalidad = async (id: number, nombre: string) => {
    try {
      console.log(nombre);

      const res = await fetch(`/api/modalidades/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error al editar modalidad:", errorData);
        notifyError(errorData.error || "Error al editar modalidad");
        return;
      }
      fetchModalidadesEtapas();
      notifySuccess("¡Modalidad editada exitosamente!");
      const modalidadActualizada = await res.json();
      setModalidades((prev) =>
        prev.map((m) => (m.id === id ? modalidadActualizada : m))
      );
    } catch (error) {
      console.error("Error al editar modalidad:", error);
      notifyError("Error al editar modalidad");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[hsl(217,26%,12%)]">
      <Navbar />
      <main className="container mx-auto px-4 py-6 ">
        <div className="flex flex-wrap items-start">
          <GestorFeriados
            feriados={feriados}
            onAgregar={agregarFeriado}
            onEditar={editarFeriado}
            onEliminar={eliminarFeriado}
          />
          <GestionarEtapas
            etapas={etapas}
            onAgregar={agregarEtapa}
            onEliminar={eliminarEtapa}
            onEditar={editarEtapa}
            obtenerUno={obtenerEtapa}
          />
          <GestionarModalidades
            modalidades={modalidades}
            onAgregar={agregarModalidad}
            onEliminar={eliminarModalidad}
            onEditar={editarModalidad}
          />
          <GestionarModalidadesEtapas
            modalidades={modalidades}
            etapas={etapas}
            modalidadesEtapas={modalidadesEtapas}
            onAgregar={agregarModalidadEtapa}
            onEliminar={eliminarModalidadEtapa}
            onEditar={editarModalidadEtapa}
          />
        </div>

        <div className="space-y-4">
          <FormularioCalculo
            onSubmit={agregarRegistro}
            modalidades={modalidades}
            loading={isLoadingSaveContratacion}
          />

          <div className="space-y-4">
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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

