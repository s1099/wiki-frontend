"use client";

import Search from "./components/Search";
import { Book } from "lucide-react";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import { Background } from "./components/Background";

export default function Home() {
  return (
    <Background containerClassName="min-h-screen flex flex-col items-center">
      <div className="w-full max-w-2xl mx-auto pt-16 sm:pt-24">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="bg-gray-900 dark:bg-white p-3 rounded-xl shadow-md hover:shadow-lg">
              <Book className="h-8 w-8 text-white dark:text-gray-900" />
            </div>
            <h1 className="text-3xl font-bold ml-4 text-gray-900 dark:text-white">
              Wikipedia
            </h1>
          </div>
          <div className="ml-4">
            <ThemeSwitcher />
          </div>
        </div>
        <Search />
      </div>
    </Background>
  );
}
