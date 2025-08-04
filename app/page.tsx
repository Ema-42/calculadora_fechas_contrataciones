"use client"

import { useState, useEffect } from "react"
import Navbar from "@/components/Navbar"
import FormularioCalculo from "@/components/FormularioCalculo"
import ListadoRegistros from "@/components/ListadoRegistros"
import Toast from "@/components/Toast"
import Footer from "@/components/Footer" // Importar el nuevo Footer

export interface Registro {
  id: number
  fechaGeneracion: string
  titulo: string
  fechaInicio: string
  modalidad: string
  monto: number
  fechaPublicacion: string
  fechaApertura: string
  fechaAdjudicacion: string
  fechaPresentacionDocs: string
  fechaFirmaContratos: string
}

export interface Feriado {
  id: number
  fecha: string
  nombre: string
}

export default function Home() {
  const [registros, setRegistros] = useState<Registro[]>([])
  const [feriados, setFeriados] = useState<Feriado[]>([])
  const [nextId, setNextId] = useState(1)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const savedRegistros = localStorage.getItem("registros-contratacion")
    const savedNextId = localStorage.getItem("next-id")
    const savedFeriados = localStorage.getItem("feriados-contratacion")

    if (savedRegistros) {
      setRegistros(JSON.parse(savedRegistros))
    }
    if (savedNextId) {
      setNextId(Number.parseInt(savedNextId))
    }
    if (savedFeriados) {
      setFeriados(JSON.parse(savedFeriados))
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
      ]
      setFeriados(feriadosDefault)
    }
  }, [])

  // Guardar en localStorage cuando cambien los datos
  useEffect(() => {
    localStorage.setItem("registros-contratacion", JSON.stringify(registros))
    localStorage.setItem("next-id", nextId.toString())
    localStorage.setItem("feriados-contratacion", JSON.stringify(feriados)) // Guardar feriados también
  }, [registros, nextId, feriados]) // Asegurarse de que feriados esté en las dependencias

  const esFeriado = (fecha: Date) => {
    const fechaStr = fecha.toISOString().split("T")[0]
    return feriados.some((feriado) => feriado.fecha === fechaStr)
  }

  const esFinDeSemana = (fecha: Date) => {
    const dia = fecha.getDay()
    return dia === 0 || dia === 6 // 0 = domingo, 6 = sábado
  }

  const esDiaHabil = (fecha: Date) => {
    return !esFinDeSemana(fecha) && !esFeriado(fecha)
  }

  const agregarDiasHabiles = (fechaInicio: Date, diasHabiles: number) => {
    const fecha = new Date(fechaInicio)
    let diasAgregados = 0

    // Si la fecha de inicio es un día no hábil, avanzar al siguiente día hábil
    while (!esDiaHabil(fecha)) {
      fecha.setDate(fecha.getDate() + 1)
    }

    while (diasAgregados < diasHabiles) {
      fecha.setDate(fecha.getDate() + 1)
      if (esDiaHabil(fecha)) {
        diasAgregados++
      }
    }

    return fecha.toISOString().split("T")[0]
  }

  const mostrarToast = (mensaje: string) => {
    setToastMessage(mensaje)
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  const agregarRegistro = (datos: {
    titulo: string
    fechaInicio: string
    monto: number
    modalidad: string
  }) => {
    const fechasCalculadas = calcularFechas(datos.fechaInicio, datos.modalidad)

    const nuevoRegistro: Registro = {
      id: nextId,
      fechaGeneracion: new Date().toISOString(),
      titulo: datos.titulo || `Proceso ${nextId}`,
      fechaInicio: datos.fechaInicio,
      modalidad: datos.modalidad,
      monto: datos.monto,
      ...fechasCalculadas,
    }

    setRegistros((prev) => [nuevoRegistro, ...prev])
    setNextId((prev) => prev + 1)
    mostrarToast("Registro creado exitosamente")
  }

  const calcularFechas = (fechaInicio: string, modalidad: string) => {
    const fecha = new Date(fechaInicio)

    // Configuración de días hábiles por modalidad
    const configuracion = {
      "ANPE menor": { publicacion: 4, apertura: 8, adjudicacion: 12, presentacion: 16, firma: 20 },
      "ANPE mayor": { publicacion: 7, apertura: 14, adjudicacion: 21, presentacion: 28, firma: 35 },
      "Contratación pública": { publicacion: 10, apertura: 20, adjudicacion: 30, presentacion: 40, firma: 50 },
      "Contratación directa": { publicacion: 2, apertura: 4, adjudicacion: 6, presentacion: 8, firma: 10 },
    }

    const config = configuracion[modalidad as keyof typeof configuracion]

    return {
      fechaPublicacion: agregarDiasHabiles(fecha, config.publicacion),
      fechaApertura: agregarDiasHabiles(fecha, config.apertura),
      fechaAdjudicacion: agregarDiasHabiles(fecha, config.adjudicacion),
      fechaPresentacionDocs: agregarDiasHabiles(fecha, config.presentacion),
      fechaFirmaContratos: agregarDiasHabiles(fecha, config.firma),
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {" "}
      {/* Fondo más gris */}
      <Navbar />
      <main className="container mx-auto px-4 py-6 space-y-8">
        <FormularioCalculo onSubmit={agregarRegistro} />
        <ListadoRegistros registros={registros} />
      </main>
      {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}
      <Footer /> {/* Añadir el Footer */}
    </div>
  )
}
