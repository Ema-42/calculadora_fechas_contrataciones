import React from "react";

interface ConfirmDeleteEtapaModalProps {
  open: boolean;
  etapaNombre: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteEtapaModal({
  open,
  onClose,
  onConfirm,
  etapaNombre,
}: ConfirmDeleteEtapaModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-white dark:bg-[hsl(217,26%,14%)] rounded-lg shadow-lg dark:shadow-gray-900/50 p-6 w-11/12 max-w-sm z-10">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          🗑️ ¿Eliminar esta etapa?
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          Esta acción marcará la etapa{" "}
          <span className="font-semibold">{etapaNombre}</span> como eliminada
          y no se podrá recuperar.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white text-sm"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
