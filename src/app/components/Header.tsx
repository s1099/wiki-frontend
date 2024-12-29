"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Search from "./Search";
import { Book, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    //thank you firefox
    if (typeof document.startViewTransition === "function") {
      document.startViewTransition(() => {
        setTheme(current => {
          if (current === 'light') return 'dark';
          if (current === 'dark') return 'system';
          return 'light';
        });
      });
    } else {
      setTheme(current => {
        if (current === 'light') return 'dark';
        if (current === 'dark') return 'system';
        return 'light';
      });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled
          ? "bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div
            className={`p-1 rounded-lg ${
              isScrolled
                ? "bg-gray-900 dark:bg-white"
                : "bg-gray-900/70 dark:bg-white/70"
            }`}
          >
            <Book
              className={`h-6 w-6 ${
                isScrolled
                  ? "text-white dark:text-gray-900"
                  : "text-white/90 dark:text-gray-900/90"
              }`}
            />
          </div>
          <h1
            className={`text-xl font-semibold ${
              isScrolled
                ? "text-gray-900 dark:text-white"
                : "text-gray-900/90 dark:text-white/90"
            }`}
          >
            Wikipedia
          </h1>
        </Link>
        <div className="flex items-center space-x-4">
          <div className="w-96">
            <Search />
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          >
            {theme === "dark" ? (
              <Moon className="h-5 w-5" />
            ) : theme === "light" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Monitor className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
