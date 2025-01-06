"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    // thank you firefox
    (document.startViewTransition
      ? document.startViewTransition.bind(document)
      : (cb: () => void) => cb())(() => {
      setTheme(theme === "dark" ? "light" : "dark");
    });
  };

  if (!mounted) {
    return (
      <button
        className="p-2 rounded-full bg-gray-200/80 dark:bg-gray-700/80 text-gray-800 dark:text-gray-200 disabled:cursor-not-allowed"
        disabled
      >
        <div className="h-5 w-5 animate-pulse" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-full bg-gray-200/80 dark:bg-gray-700/80 backdrop-blur text-gray-800
              dark:text-gray-200 transition-all duration-300"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      <div className="relative w-5 h-5">
        <div
          className={`absolute inset-0 transform transition-transform duration-500 rotate-0
            ${theme === "dark" ? "rotate-180" : "rotate-0"}`}
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 transition-colors" />
          ) : (
            <Moon className="w-5 h-5 transition-colors" />
          )}
        </div>
      </div>
    </button>
  );
}
