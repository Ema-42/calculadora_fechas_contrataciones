"use client";

import { useState, useRef, useEffect } from "react";

import { auth } from "@/app/firebase/config";
import { LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import LogoutModal from "./LogoutModal";
import axios from "axios";
import FullScreenLoader from "./FullScreenLoader";
export default function Navbar() {
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null); // Referencia al contenedor del calendario
  const [mostrarTooltipMobile, setMostrarTooltipMobile] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);

  const [openLogout, setOpenLogout] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Efecto para manejar clics fuera del calendario
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setMostrarCalendario(false);
      }
    };

    if (mostrarCalendario) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mostrarCalendario]);

  const handleLogout = async () => {
    try {
      setLoadingLogout(true); // mostrar loader
      await signOut(auth);
      await axios("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch (error) {
      console.error("Error signing out:", error);
      setLoadingLogout(false);
    }
  };
  if (loadingLogout) {
    return <FullScreenLoader />;
  }

  const getUserDisplayName = () => {
    //if (auth.currentUser?.displayName) return auth.currentUser.displayName;
    if (auth.currentUser?.email) return auth.currentUser.email.split("@")[0];
    return "";
  };

  return (
    <nav className="bg-red-600 text-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <div className="flex-shrink-0">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-wide">
              CONTRATACIONES
            </h1>
          </div>

          {/* User section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden sm:flex items-center gap-2 text-sm relative group">
              {auth.currentUser?.photoURL && (
                <img
                  src={auth.currentUser.photoURL}
                  alt="User avatar"
                  className="w-8 h-8 lg:w-10 lg:h-10 rounded-full object-cover cursor-pointer ring-2 ring-white/30 hover:ring-white/60 transition-all"
                />
              )}
              <span className="cursor-pointer  transition-colors truncate max-w-32 lg:max-w-none">
                👋​ Hola,{" "}
                <span className="px-2 py-1  bg-gray-100/20 rounded-full hover:bg-gray-100/35">
                  {getUserDisplayName()}
                </span>
              </span>

              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2
              bg-gray-800 text-white text-xs rounded-md px-3 py-2
              opacity-0 group-hover:opacity-100
              pointer-events-none transition-all duration-200 whitespace-nowrap
              before:content-[''] before:absolute before:bottom-full before:left-1/2 
              before:-translate-x-1/2 before:border-4 before:border-transparent 
              before:border-b-gray-800"
              >
                {auth.currentUser?.email}
              </div>
            </div>

            {/* Mobile user avatar only */}
            <div className="sm:hidden flex items-center relative">
              {auth.currentUser && (
                <>
                  {auth.currentUser.photoURL ? (
                    <img
                      src={auth.currentUser.photoURL}
                      alt="User avatar"
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-white/70 cursor-pointer
                         hover:ring-white/60 transition-all active:scale-95"
                      onClick={() =>
                        setMostrarTooltipMobile(!mostrarTooltipMobile)
                      }
                    />
                  ) : (
                    <div
                      className="w-8 h-8 rounded-full bg-sky-700 ring-2 ring-sky-400/70 flex items-center justify-center
                        cursor-pointer hover:ring-white/60 transition-all
                        active:scale-95"
                      onClick={() =>
                        setMostrarTooltipMobile(!mostrarTooltipMobile)
                      }
                    >
                      <span className="text-white font-semibold text-sm">
                        {auth.currentUser?.email
                          ? auth.currentUser.email.charAt(0).toUpperCase()
                          : "U"}
                      </span>
                    </div>
                  )}

                  {/* Mobile tooltip */}
                  {mostrarTooltipMobile && (
                    <>
                      {/* Backdrop para cerrar el tooltip */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setMostrarTooltipMobile(false)}
                      />

                      <div
                        className="absolute top-full right-0 mt-2 bg-gray-800 text-white text-sm 
                             rounded-lg px-4 py-3 shadow-xl z-50 min-w-max max-w-xs
                             before:content-[''] before:absolute before:bottom-full before:right-4
                             before:border-4 before:border-transparent before:border-b-gray-800
                             slide-in-from-top-2"
                      >
                        <div className="font-medium text-white">
                          {auth.currentUser?.displayName}
                        </div>
                        <div className="text-gray-300 mt-1 text-xs">
                          {auth.currentUser?.email}
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Logout button */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpenLogout(!openLogout)}
                className="p-2 lg:p-3 hover:bg-red-700 rounded-lg transition-all duration-200 
                   hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 
                   focus:ring-white/50"
                title="Cerrar sesión"
              >
                <LogOut size={20} className="lg:w-5 lg:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <LogoutModal
        openLogout={openLogout}
        onClose={() => setOpenLogout(false)}
        onConfirm={() => {
          handleLogout();
          setOpenLogout(false);
        }}
      />
    </nav>
  );
}

