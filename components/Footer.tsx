"use client"

import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-red-800 text-white py-8 mt-8">
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-bold">CALCULADORA DE FECHAS - CONTRATACIÓN</h3>
            <p className="text-sm text-red-200">Tu herramienta para la gestión de procesos</p>
          </div>

          <div className="flex space-x-6 mb-4 md:mb-0">
            <a href="#" className="hover:text-red-300 transition-colors" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a href="#" className="hover:text-red-300 transition-colors" aria-label="Twitter">
              <Twitter size={20} />
            </a>
            <a href="#" className="hover:text-red-300 transition-colors" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="#" className="hover:text-red-300 transition-colors" aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>
          </div>

          <div className="text-sm text-red-200">
            <p>Oficina de Desarrollo: Vercel Labs</p>
            <p>Contacto: info@example.com</p>
          </div>
        </div>

        <div className="border-t border-red-700 pt-6 text-sm text-red-200">
          <p>&copy; {currentYear} Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
