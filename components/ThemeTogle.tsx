"use client";
import { Moon, MoonStar, Sun, SunDim } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Leer preferencia guardada
    const theme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (theme === "dark" || (!theme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-1 rounded-xl bg-black/20 dark:bg-white/10 
             border border-white/10 dark:border-white/5 
             backdrop-blur-xl shadow-sm hover:shadow-lg 
             transition-all duration-300 flex items-center justify-center"
      aria-label="Toggle dark mode"
      title="Modo oscuro / claro"
    >
      {isDark ? (
        <SunDim
          className="w-6  h-6  text-gray-100 dark:text-gray-200   
                transition-all duration-300 rotate-0 scale-100 
                group-hover:scale-110"
          aria-hidden="true"
        />
      ) : (
        <MoonStar
          className="w-6  h-6  text-gray-100 dark:text-gray-200 
                transition-all duration-300 rotate-0 scale-100 
                group-hover:scale-110"
          aria-hidden="true"
        />
      )}
    </button>
  );
}
