"use client";
import type React from "react";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import axios from "axios";
import FullScreenLoader from "@/components/FullScreenLoader";
import ThemeToggle from "@/components/ThemeTogle";
import { showToast } from "nextjs-toast-notify";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingHome, setLoadingHome] = useState(false);

  const notifySuccess = (msg: string) => {
    showToast.success(msg, {
      duration: 2000,
      progress: true,
      position: "top-right",
      transition: "bounceIn",
      icon: "",
      sound: true,
    });
  };

  const notifyError = (msg: string) => {
    showToast.error(msg, {
      duration: 2000,
      progress: true,
      position: "top-right",
      transition: "bounceIn",
      icon: "",
      sound: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const email = e.currentTarget.username.value;
    const password = e.currentTarget.password.value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (auth.currentUser) {
        setLoadingHome(true);
        const response = await axios.post("/api/auth/login", {
          user: auth.currentUser,
        });
      }
      notifySuccess("¡Inicio de sesión exitoso!");
      router.push("/home");
    } catch (error: any) {
      let errorMessage = "Error interno del servidor";
      if (error.code === "auth/invalid-credential") {
        errorMessage = "Credenciales inválidas";
      }
      notifyError(`Error: ${errorMessage}`);
      setLoadingHome(false);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (loadingHome) {
    return <FullScreenLoader />;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Botón de Theme Toggle - Posición absoluta */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Panel Izquierdo - Imagen de fondo con overlay (75% en desktop) */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
        {/* Imagen de fondo */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/fondo.jpg')",
          }}
        />

        {/* Overlay con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 " />

        {/* Contenido del panel izquierdo */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div>
            <img
              src="/logo.png"
              alt="Logo"
              className="
              w-20 h-20 rounded-full shadow-lg filter invert  ]
            "
            />
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight">
              Sistema de
              <br />
              Contrataciones
            </h1>
            <p className="text-lg text-white/90 max-w-md leading-relaxed">
              Gestiona y administra todas las contrataciones de manera eficiente
              y segura.
            </p>
            <div className="h-1 w-20 bg-white/40 rounded-full" />
          </div>

          <div className="text-sm text-white/70">
            <p>
              © {new Date().getFullYear()} Jefatura de Tecnologías de la
              Información
            </p>
            <p className="mt-1">Todos los derechos reservados</p>
          </div>
        </div>
      </div>

      {/* Panel Derecho - Formulario de Login (25% en desktop) */}
      <div className="flex-1 lg:w-2/5 flex items-center justify-center p-6 lg:p-8 bg-white dark:bg-[hsl(217,26%,12%)]">
        <div className="w-full max-w-sm">
          {/* Logo en móvil */}
          <div className="lg:hidden flex justify-center mb-8">
            <img
              src="/logo.png"
              alt="Logo"
              className="
              w-20 h-20 rounded-full shadow-lg
              [filter:invert(28%)_sepia(88%)_saturate(5000%)_hue-rotate(-5deg)_brightness(95%)_contrast(120%)]
              dark:[filter:invert_saturate(9000%)  ]
            "
            />
          </div>

          {/* Encabezado */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Bienvenido
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          {/* Formulario */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Campo Email */}
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="email"
                  id="username"
                  name="username"
                  className="block w-full pl-12 pr-4 py-3.5 border border-gray-300  dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            {/* Campo Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="block w-full pl-12 pr-12 py-3.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            {/* Link Olvidó contraseña */}
            <div className="flex justify-end">
              <a
                href="/forgot-password"
                className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
              >
                ¿Olvidó su contraseña?
              </a>
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Iniciando sesión...
                </div>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>

          {/* Footer en móvil */}
          <div className="lg:hidden text-center mt-8 text-xs text-gray-500 dark:text-gray-400">
            <p>© {new Date().getFullYear()} Todos los derechos reservados</p>
            <p className="mt-1">Jefatura de Tecnologías de la Información</p>
          </div>
        </div>
      </div>
    </div>
  );
}
