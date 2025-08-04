"use client";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, FileText, X } from "lucide-react"; // Eliminar Printer
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { generateMassRecordPdf } from "@/lib/pdf-utils";

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

interface ModalImprimirTodosProps {
  registros: Registro[];
  onClose: () => void;
}

export default function ModalImprimirTodos({
  registros,
  onClose,
}: ModalImprimirTodosProps) {
  const [fechaInicioRango, setFechaInicioRango] = useState<Date | undefined>(
    undefined
  );
  const [fechaFinRango, setFechaFinRango] = useState<Date | undefined>(
    undefined
  );

  const handleGeneratePDF = () => {
    let registrosFiltrados = registros;

    if (fechaInicioRango && fechaFinRango) {
      registrosFiltrados = registros.filter((registro) => {
        const fechaGeneracion = parseISO(registro.fechaGeneracion);
        const inicioDelDia = new Date(fechaInicioRango.setHours(0, 0, 0, 0));
        const finDelDia = new Date(fechaFinRango.setHours(23, 59, 59, 999));
        return fechaGeneracion >= inicioDelDia && fechaGeneracion <= finDelDia;
      });
    }

    if (registrosFiltrados.length === 0) {
      alert(
        "No hay registros para generar el PDF en el rango de fechas seleccionado."
      );
      return;
    }

    generateMassRecordPdf(
      registrosFiltrados,
      "download",
      fechaInicioRango,
      fechaFinRango
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold text-gray-800  flex items-center">
          <FileText className="mr-2 text-red-600" size={24} />
          Generar PDF de Registros
        </h2>
        <span className="text-sm text-gray-500">
          Seleccione un rango de fechas para el informe.
        </span>

        <div className="space-y-4 mb-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha inicial
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !fechaInicioRango && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fechaInicioRango ? (
                    format(fechaInicioRango, "PPP", { locale: es })
                  ) : (
                    <span>Seleccionar fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={fechaInicioRango}
                  onSelect={setFechaInicioRango}
                  initialFocus
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha final
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !fechaFinRango && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fechaFinRango ? (
                    format(fechaFinRango, "PPP", { locale: es })
                  ) : (
                    <span>Seleccionar fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={fechaFinRango}
                  onSelect={setFechaFinRango}
                  initialFocus
                  locale={es}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleGeneratePDF}
            className="w-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center"
          >
            <FileText className="mr-2" size={16} />
            Generar PDF
          </Button>
          {/* Botón "Imprimir PDF" eliminado */}
        </div>
        <p className="text-center text-sm text-gray-500 mt-2">
          *Si no se seleccionan fechas, se generará un PDF con todos los
          registros.
        </p>
      </div>
    </div>
  );
}
