import React from "react";

interface LogoutModalProps {
  openLogout: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({
  openLogout,
  onClose,
  onConfirm,
}: LogoutModalProps) {
  if (!openLogout) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
      {/* Fondo oscuro y borroso */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose} // cerrar al hacer click fuera
      ></div>

      {/* Contenedor del modal */}
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-sm z-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          ¿Seguro que quieres cerrar sesión?
        </h2>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-800 text-sm"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm"
          >
            Sí
          </button>
        </div>
      </div>
    </div>
  );
}
