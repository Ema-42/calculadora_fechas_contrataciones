import React from "react";

export default function FullScreenLoader() {
  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gradient-to-b from-red-600 via-red-700 to-red-800">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <span className="text-white text-lg font-semibold">Cargando...</span>
      </div>
    </div>
  );
}
