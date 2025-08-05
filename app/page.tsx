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
export default function Home() {
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [feriados, setFeriados] = useState<Feriado[]>([]);
  const [modalidades, setModalidades] = useState<Modalidad[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchRegistros = async () => {
      try {
        const res = await fetch("/api/contrataciones");
        if (!res.ok) throw new Error("Error al cargar registros");
        const data = await res.json();
        console.log("Contrataciones desde API:", data);
        setRegistros(data);
      } catch (error: any) {
        console.error("Error al obtener registros:", error?.message || error);
        setToastMessage("Hubo un error al cargar los registros.");
        setShowToast(true);
      }
    };

    fetchRegistros();
  }, []);

  useEffect(() => {
    const fetchModalidades = async () => {
      try {
        const res = await fetch("/api/modalidades");
        if (!res.ok) throw new Error("Error al cargar modalidades");
        const data = await res.json();
        console.log("Modalidades desde API:", data);
        setModalidades(data);
      } catch (error: any) {
        console.error("Error al obtener registros:", error?.message || error);
        setToastMessage("Hubo un error al cargar los registros.");
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
        console.log("Feriados desde API:", data);
        setFeriados(data);
      } catch (error: any) {
        console.error("Error al obtener registros:", error?.message || error);
        setToastMessage("Hubo un error al cargar los registros.");
        setShowToast(true);
      }
    };

    fetchFeriados();
  }, []);

  /*   // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const savedRegistros = localStorage.getItem("registros-contratacion");
    const savedNextId = localStorage.getItem("next-id");
    const savedFeriados = localStorage.getItem("feriados-contratacion");

    if (savedRegistros) {
      setRegistros(JSON.parse(savedRegistros));
    }
    if (savedNextId) {
      setNextId(Number.parseInt(savedNextId));
    }
    if (savedFeriados) {
      setFeriados(JSON.parse(savedFeriados));
    } else {
      // Feriados por defecto (gestionados desde el código)
      const feriadosDefault = [
        { id: 1, fecha: "2025-01-01", nombre: "Año Nuevo" },
        { id: 2, fecha: "2025-01-06", nombre: "Día de Reyes" },
        { id: 3, fecha: "2025-04-18", nombre: "Viernes Santo" },
        { id: 4, fecha: "2025-05-01", nombre: "Día del Trabajador" },
        { id: 5, fecha: "2025-08-15", nombre: "Asunción de la Virgen" },
        { id: 6, fecha: "2025-10-12", nombre: "Día de la Hispanidad" },
        { id: 7, fecha: "2025-11-01", nombre: "Todos los Santos" },
        { id: 8, fecha: "2025-12-06", nombre: "Día de la Constitución" },
        { id: 9, fecha: "2025-12-08", nombre: "Inmaculada Concepción" },
        { id: 10, fecha: "2025-12-25", nombre: "Navidad" },
      ];
      setFeriados(feriadosDefault);
    }
  }, []);

  // Guardar en localStorage cuando cambien los datos
  useEffect(() => {
    localStorage.setItem("registros-contratacion", JSON.stringify(registros));
    localStorage.setItem("next-id", nextId.toString());
    localStorage.setItem("feriados-contratacion", JSON.stringify(feriados)); // Guardar feriados también
  }, [registros, nextId, feriados]); // Asegurarse de que feriados esté en las dependencias */

  const esFeriado = (fecha: Date) => {
    const fechaStr = fecha.toISOString().split("T")[0];
    return feriados.some((feriado) => {
      const feriadoStr = new Date(feriado.fecha).toISOString().split("T")[0];
      return feriadoStr === fechaStr;
    });
  };

  const esFinDeSemana = (fecha: Date) => {
    const dia = fecha.getDay();
    return dia === 0 || dia === 6; // 0 = domingo, 6 = sábado
  };

  const esDiaHabil = (fecha: Date) => {
    esFeriado(fecha) && console.log(`Fecha ${fecha} es feriado`);
    return !esFinDeSemana(fecha) && !esFeriado(fecha);
  };

  const agregarDiasHabiles = (fechaInicio: Date, diasHabiles: number) => {
    const fecha = new Date(fechaInicio);
    let diasAgregados = 0;

    // Si la fecha de inicio es un día no hábil, avanzar al siguiente día hábil
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
    console.log("Datos recibidos en agregarRegistro:", datos);

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
    console.log("Payload a enviar:", payload);

    try {
      const res = await fetch("/api/contrataciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al crear registro");

      const nuevo = await res.json();

      // Agrega el registro a la lista actual en memoria (opcional)
      setRegistros((prev) => [nuevo, ...prev]);
      mostrarToast("Registro creado exitosamente");
    } catch (error) {
      console.error("Error en agregarRegistro:", error);
      mostrarToast("Error al crear el registro");
    }
  };

  function parseFechaLocal(fechaStr: string): Date {
    const [year, month, day] = fechaStr.split("-").map(Number);
    // Nota: mes es 0-based en JS Date (enero = 0)
    return new Date(year, month - 1, day);
  }

  const calcularFechas = (fechaInicio: string, modalidadId: number) => {
    const fecha = parseFechaLocal(fechaInicio); // <-- fecha local correcta
    console.log("Fecha de inicio:", fecha);

    console.log(modalidadId + " modalidadId");

    // Configuración de días hábiles por modalidad
    const configuracion = {
      1: {
        publicacion: 4,
        apertura: 8,
        adjudicacion: 12,
        presentacion: 16,
        firma: 20,
      },
      "ANPE mayor": {
        publicacion: 7,
        apertura: 14,
        adjudicacion: 21,
        presentacion: 28,
        firma: 35,
      },
      "Contratación pública": {
        publicacion: 10,
        apertura: 20,
        adjudicacion: 30,
        presentacion: 40,
        firma: 50,
      },
      "Contratación directa": {
        publicacion: 2,
        apertura: 4,
        adjudicacion: 6,
        presentacion: 8,
        firma: 10,
      },
    };

    const config = configuracion[modalidadId as keyof typeof configuracion];

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
      {" "}
      {/* Fondo más gris */}
      <Navbar />
      <main className="container mx-auto px-4 py-6 space-y-8">
        <FormularioCalculo
          onSubmit={agregarRegistro}
          modalidades={modalidades}
        />
        <ListadoRegistros registros={registros} />
      </main>
      {showToast && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
      )}
      <Footer /> {/* Añadir el Footer */}
    </div>
  );
}

