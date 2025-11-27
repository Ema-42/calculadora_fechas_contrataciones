"use client";
//@ts-ignore
import "./style.css";

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
      router.push("/home"); // No setLoadingHome(false) aquí
    } catch (error: any) {
      let errorMessage = "Error interno del servidor";

      if (error.code === "auth/invalid-credential") {
        errorMessage = "Credenciales inválidas";
      }

      notifyError(`Error: ${errorMessage}`);
      setLoadingHome(false); // Solo en caso de error
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
    <>
      {/* Fondo animado */}
      <ul className="background">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      <div className="flex flex-col px-4 sm:px-0 min-h-screen items-center justify-center relative z-10">
        <div className="w-full max-w-md ">
          {/* Card principal */}
          <div className="bg-gray-100 dark:bg-[hsl(217,26%,14%)] rounded-2xl shadow-xl dark:shadow-gray-900/50 overflow-hidden">
            <div className="bg-slate-600 dark:bg-slate-700 px-8 py-2">
              <h2 className="text-2xl font-bold text-white text-center uppercase">
                Contrataciones
              </h2>
            </div>

            <div className="px-8 py-6">
              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Campo Email */}
                <div className="space-y-2">
                  <label
                    htmlFor="username"
                    className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Correo
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                    </div>
                    <input
                      type="email"
                      id="username"
                      name="username"
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-700 dark:text-gray-200"
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      className="block w-full pl-10 pr-12 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-slate-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-700 dark:text-gray-200"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 transition-colors" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-400 dark:text-gray-400">
              ¿Olvidó su contraseña?{" "}
              <a
                href="/forgot-password"
                className="text-gray-600 dark:text-gray-300 font-bold hover:text-gray-800 dark:hover:text-gray-100 underline"
              >
                Recuperar acceso
              </a>
            </p>{" "}
          </div>
        </div>
        <div className="mt-12 text-center text-gray-200 text-xs flex flex-col items-center gap-2 mb-0 ">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-12 h-auto mx-auto rounded-full filter brightness-0 invert"
          />

          <p>
            © {new Date().getFullYear()} Todos los derechos reservados -
            Jefatura de Tenologías de la Información.
          </p>
        </div>
      </div>
    </>
  );
}
