import React from "react";
import { X, RefreshCw, AlertTriangle } from "lucide-react";

interface ConfirmRestaurarFeriadosModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  añoAnterior: number;
  añoActual: number;
  isLoading?: boolean;
}

export default function ConfirmRestaurarFeriadosModal({
  open,
  onClose,
  onConfirm,
  añoAnterior,
  añoActual,
  isLoading = false,
}: ConfirmRestaurarFeriadosModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-[60] p-4">
      <div className="bg-white dark:bg-[hsl(217,26%,14%)] rounded-lg shadow-xl dark:shadow-gray-900/50 w-full max-w-md">
        {/* Header */}
        <div className="bg-blue-600 dark:bg-blue-700 px-6 py-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center">
            <RefreshCw className="mr-2 text-white" size={24} />
            <h2 className="text-xl font-semibold text-white">
              Restaurar Feriados
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-white hover:text-gray-200 transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-start space-x-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-amber-800 dark:text-amber-200 font-medium mb-2">
                ¿Estás seguro de restaurar los feriados?
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                Esta acción copiará todos los feriados del año {añoAnterior} al
                año {añoActual}.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-[hsl(217,26%,18%)] p-4 rounded-lg space-y-2">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">¿Qué sucederá?</span>
            </p>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-4 list-disc">
              <li>
                Se copiarán los feriados de {añoAnterior} a {añoActual}
              </li>
              <li>
                Los feriados existentes en {añoActual} no serán modificados
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 h-[42px] px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md font-medium hover:bg-gray-50 dark:hover:bg-[hsl(217,26%,18%)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 h-[42px] bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white px-4 rounded-md font-medium transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw
              className={`mr-2 ${isLoading ? "animate-spin" : ""}`}
              size={16}
            />
            {isLoading ? "Restaurando..." : "Restaurar"}
          </button>
        </div>
      </div>
    </div>
  );
}