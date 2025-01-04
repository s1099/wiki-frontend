"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Search from "./Search";
import { Book } from "lucide-react";
import { ThemeSwitcher } from "./ThemeSwitcher";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
            className={`p-1 rounded-xl ${
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
            className={`hidden sm:block text-xl font-semibold ${
              isScrolled
                ? "text-gray-900 dark:text-white"
                : "text-gray-900/90 dark:text-white/90"
            }`}
          >
            Wikipedia
          </h1>
        </Link>
        <div className="flex items-center space-x-2 sm:space-x-4 flex-1 max-w-lg mx-4">
          <div className="w-full">
            <Search />
          </div>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
