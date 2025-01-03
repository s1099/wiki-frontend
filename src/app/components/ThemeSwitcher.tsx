"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    //thank you firefox
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setTheme(theme === "dark" ? "light" : "dark");
      });
    } else {
      setTheme(theme === "dark" ? "light" : "dark");
    }

    // document.startViewTransition?.(() => {
    //   setTheme(theme === "dark" ? "light" : "dark");
    // }) || setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
}
