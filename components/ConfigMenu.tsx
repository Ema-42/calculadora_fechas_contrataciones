"use client";

import { useState, useRef, useEffect } from "react";
import { Settings, Calendar, Layers, Package, GitBranch } from "lucide-react";

interface ConfigMenuProps {
  onOpenFeriados: () => void;
  onOpenEtapas: () => void;
  onOpenModalidades: () => void;
  onOpenModalidadesEtapas: () => void;
}

export default function ConfigMenu({
  onOpenFeriados,
  onOpenEtapas,
  onOpenModalidades,
  onOpenModalidadesEtapas,
}: ConfigMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const menuItems = [
    {
      icon: Calendar,
      label: "Feriados",
      onClick: () => {
        onOpenFeriados();
        setIsOpen(false);
      },
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Layers,
      label: "Etapas",
      onClick: () => {
        onOpenEtapas();
        setIsOpen(false);
      },
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: Package,
      label: "Modalidades",
      onClick: () => {
        onOpenModalidades();
        setIsOpen(false);
      },
      color: "text-green-600 dark:text-green-400",
    },
    {
      icon: GitBranch,
      label: "Modalidades-Etapas",
      onClick: () => {
        onOpenModalidadesEtapas();
        setIsOpen(false);
      },
      color: "text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <div ref={menuRef} className="fixed bottom-6 right-6 z-50">
      {/* Backdrop cuando está abierto (solo móvil) */}
      {isOpen && (
        <div
          className="sm:hidden fixed inset-0 bg-black/20 -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menú desplegable */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 mb-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 min-w-[280px] overflow-hidden">
          <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
              <Settings size={16} />
              Configuración
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Gestionar datos del sistema
            </p>
          </div>

          <div className="p-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              >
                <div
                  className={`${item.color} group-hover:scale-110 transition-transform`}
                >
                  <item.icon size={20} />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Botón principal flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 rounded-full shadow-xl flex items-center justify-center
          transition-all duration-300 transform hover:scale-110
          ${
            isOpen
              ? "bg-gray-700 dark:bg-gray-600 rotate-90"
              : "bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 hover:shadow-2xl"
          }
        `}
        title="Configuración"
      >
        <Settings
          size={24}
          className={`text-white transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
    </div>
  );
}
