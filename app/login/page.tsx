"use client";
//@ts-ignore
import "./style.css";

import type React from "react";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

import axios from "axios";
import FullScreenLoader from "@/components/FullScreenLoader";
export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingHome, setLoadingHome] = useState(false);

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
      <div className="flex flex-col px-4 sm:px-0 min-h-screen items-center justify-center   relative z-10">
        <div className="w-full max-w-md ">
          {/* Card principal */}
          <div className="bg-gray-100 rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-slate-600 px-8 py-2">
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
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Correo
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
            <p className="text-sm text-gray-300">
              ¿Olvidó su contraseña?{" "}
              <a
                href="/forgot-password"
                className="text-gray-200 font-bold hover:text-white underline"
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
        <ToastContainer />
      </div>
    </>
  );
}
