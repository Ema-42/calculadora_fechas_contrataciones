"use client";

import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ mensaje = "Cargando datos..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
      <Loader2 className="animate-spin h-8 w-8 text-red-600 mb-4" />
      <p className="text-lg">{mensaje}</p>
    </div>
  );
}
