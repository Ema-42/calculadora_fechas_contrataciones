import React from "react";

interface ConfirmDeleteFeriadoModalProps {
  open: boolean;
  feriadoNombre: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteFeriadoModal({
  open,
  onClose,
  onConfirm,
  feriadoNombre
}: ConfirmDeleteFeriadoModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-sm z-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          🗑️ ¿Eliminar este feriado?
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Esta acción marcará el feriado de <span className="font-semibold">{feriadoNombre}</span> como eliminado y no se podrá recuperar.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
