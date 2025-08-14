"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/config";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import FullScreenLoader from "@/components/FullScreenLoader";
export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingHome, setLoadingHome] = useState(false);

  /*   useEffect(() => {
    setLoadingHome(true);
    const verificarToken = async () => {
      try {
        const res = await axios.get("/api/auth/verify-token");
        if (res.data.ok) {
          router.push("/home");
        }
      } catch {}
    };

    verificarToken();
    setLoadingHome(false);
  }, [router]); */

  const notifySuccess = (msg: string) =>
    toast.success(msg, {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: false,
      closeButton: false,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  const notifyError = (msg: string) =>
    toast.error(msg, {
      position: "top-right",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: false,
      closeButton: false,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  // Mantener la función de Google pero comentada
  /*   const signIn = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await signInWithPopup(auth, googleProvider);
      router.push("/home");
    } catch (error) {
      console.error("Error signing in:", error);
    } finally {
      setIsLoading(false);
    }
  }; */

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsLoading(true);

  const email = e.currentTarget.username.value;
  const password = e.currentTarget.password.value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    if (auth.currentUser) {
      setLoadingHome(true); // mostrar loader global
      //console.log("Usuario autenticado:", auth.currentUser);
      const response = await axios.post("/api/auth/login", {
        user: auth.currentUser,
      });
      //console.log("Respuesta del API:", response.data);
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
    <div className="flex flex-col px-4 sm:px-0 min-h-screen items-center justify-center bg-gray-300/80">
      <div className="w-full max-w-md">
        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-xl     overflow-hidden">
          {/* Header con gradiente rojo */}
          <div className="bg-red-800 px-8 py-6">
            <h2 className="text-2xl font-bold text-white text-center">
              Bienvenido
            </h2>
            <p className="text-red-100 text-center text-sm mt-1">
              Inicia sesión en tu cuenta
            </p>
          </div>

          {/* Formulario */}
          <div className="px-8 py-6">
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Campo Email */}
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Correo electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    id="username"
                    name="username"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>

              {/* Campo Contraseña */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className="block w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-slate-50 focus:bg-white"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              {/* Botón de acceso */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-red-800 text-white font-semibold rounded-lg hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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

              {/* Botón de Google comentado */}
              {/* 
              <button
                type="button"
                onClick={signIn}
                disabled={isLoading}
                className="w-full py-3 px-4 bg-white border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar con Google
              </button>
              */}
            </form>
          </div>
        </div>

        {/* Footer opcional */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-700">
            ¿Olvidaste tu contraseña?{" "}
            <a
              href="/forgot-password"
              className="text-red-500 font-bold hover:text-red-700 underline"
            >
              Recuperar acceso
            </a>
          </p>{" "}
        </div>
      </div>
      <div className="mt-12 text-center text-gray-600 text-xs flex flex-col items-center gap-2 mb-0 ">
        <img
          src="/logo.png" // Cambia esta ruta por la correcta de tu logo
          alt="Logo de la oficina desarrolladora"
          className="w-12 h-auto mx-auto rounded-full"
        />
        <p>
          © 2025 Todos los derechos reservados - Jefatura de Tenologías de la
          Información.
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}
