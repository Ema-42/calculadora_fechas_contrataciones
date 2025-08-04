"use client";

import { useState, useRef, useEffect } from "react";
import {
  Calendar,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
} from "lucide-react";

export default function Navbar() {
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [fechaCalendario, setFechaCalendario] = useState(new Date());
  const calendarRef = useRef<HTMLDivElement>(null); // Referencia al contenedor del calendario

  // Efecto para manejar clics fuera del calendario
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setMostrarCalendario(false);
      }
    };

    if (mostrarCalendario) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mostrarCalendario]);

  const obtenerFechaActual = () => {
    const fecha = new Date();
    const dias = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    const meses = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];

    const diaSemana = dias[fecha.getDay()];
    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const año = fecha.getFullYear();

    return `${diaSemana} ${dia} de ${mes} de ${año}`;
  };

  const obtenerDiasDelMes = (fecha: Date) => {
    const año = fecha.getFullYear();
    const mes = fecha.getMonth();

    // Primer día del mes
    const primerDia = new Date(año, mes, 1);
    // Último día del mes
    const ultimoDia = new Date(año, mes + 1, 0);

    // Día de la semana del primer día (0 = domingo)
    const primerDiaSemana = primerDia.getDay();

    const dias = [];

    // Agregar días vacíos al inicio
    for (let i = 0; i < primerDiaSemana; i++) {
      dias.push(null);
    }

    // Agregar todos los días del mes
    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
      dias.push(dia);
    }

    return dias;
  };

  const cambiarMes = (direccion: number) => {
    setFechaCalendario((prev) => {
      const nuevaFecha = new Date(prev);
      nuevaFecha.setMonth(prev.getMonth() + direccion);
      return nuevaFecha;
    });
  };

  const esHoy = (dia: number) => {
    const hoy = new Date();
    return (
      hoy.getDate() === dia &&
      hoy.getMonth() === fechaCalendario.getMonth() &&
      hoy.getFullYear() === fechaCalendario.getFullYear()
    );
  };

  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const diasSemana = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  return (
    <nav className="bg-red-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <CircleDollarSign  className="h-6 w-6 text-white" />
            <h1 className="text-xl font-bold tracking-wide">
              PROCESOS DE CONTRATACIÓN
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <span className="hidden md:block text-sm">
              {obtenerFechaActual()}
            </span>

            <div className="relative">
              <button
                onClick={() => setMostrarCalendario(!mostrarCalendario)}
                className="p-2 hover:bg-red-700 rounded-lg transition-colors"
                title="Ver calendario"
              >
                <Calendar size={20} />
              </button>

              {mostrarCalendario && (
                <div
                  ref={calendarRef} // Asignar la referencia al contenedor del calendario
                  className="absolute right-0 top-12 bg-white text-black p-4 rounded-lg shadow-xl z-50 min-w-[320px]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold flex items-center">
                      <CalendarDays size={16} className="mr-2" />
                      Calendario
                    </h3>
                    <button
                      onClick={() => setMostrarCalendario(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ×
                    </button>
                  </div>

                  {/* Navegación del mes */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => cambiarMes(-1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <h4 className="font-medium">
                      {meses[fechaCalendario.getMonth()]}{" "}
                      {fechaCalendario.getFullYear()}
                    </h4>
                    <button
                      onClick={() => cambiarMes(1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  {/* Días de la semana */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {diasSemana.map((dia) => (
                      <div
                        key={dia}
                        className="text-center text-xs font-medium text-gray-500 p-2"
                      >
                        {dia}
                      </div>
                    ))}
                  </div>

                  {/* Días del mes */}
                  <div className="grid grid-cols-7 gap-1">
                    {obtenerDiasDelMes(fechaCalendario).map((dia, index) => (
                      <div
                        key={index}
                        className={`text-center p-2 text-sm ${
                          dia === null
                            ? ""
                            : esHoy(dia)
                            ? "bg-red-600 text-white rounded-full font-bold"
                            : "hover:bg-gray-100 rounded cursor-pointer"
                        }`}
                      >
                        {dia}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t text-center">
                    <p className="text-xs text-gray-500">
                      Hoy: {obtenerFechaActual()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Fecha en móvil */}
        <div className="md:hidden pb-3 text-sm text-center">
          {obtenerFechaActual()}
        </div>
      </div>
    </nav>
  );
}

