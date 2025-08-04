"use client";

import {
  Calendar,
  Clock,
  Users,
  Monitor,
  Heart,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-red-800 text-white py-12 px-4 mt-8">
      <div className="container mx-auto max-w-6xl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white p-2 rounded-lg">
                <Calendar className="h-6 w-6 text-red-800" />
              </div>
              <div>
                <h3 className="text-xl font-bold">CALCULADORA DE FECHAS</h3>
                <p className="text-sm text-red-200">CONTRATACIÓN</p>
              </div>
            </div>
            <p className="text-red-100 mb-4 leading-relaxed">
              Herramienta especializada para la gestión eficiente de procesos de
              contratación, facilitando el cálculo automático de fechas críticas
              y la administración de cronogramas.
            </p>
          </div>

          {/* Features Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Características
            </h4>
            <ul className="space-y-2 text-red-200">
              <li className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                Cálculo automático de fechas
              </li>

              <li className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                Reportes en PDF
              </li>
              <li className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                Registro histórico de contrataciones
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Jefatura de TI
            </h4>
            <div className="space-y-3 text-red-200">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4" />
                <a href="mailto:info.gamsucre@gmail.com" target="_blank">
                  <span>info.gamsucre@gmail.com</span>
                </a>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" />
                <a
                  href="https://maps.app.goo.gl/MKtQUtFLHHAmbGiY8"
                  target="_blank"
                >
                  <span>Sucre, Bolivia (Complejo Yurac Yurac)</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-red-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-sm text-red-200">
                &copy; {currentYear} Todos los derechos reservados.
              </p>
              <p className="text-xs text-red-300 mt-1">
                Sistema de Gestión de Contrataciones
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

