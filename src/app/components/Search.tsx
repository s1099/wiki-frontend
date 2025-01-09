"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search as SearchIcon, X, ArrowRight, Loader2 } from "lucide-react";

interface SearchResult {
  title: string;
  description: string;
  thumbnail?: string;
  pageid: number;
  snippet: string;
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (value.trim()) {
      setIsLoading(true);
      try {
        const searchResponse = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=search&srsearch=${encodeURIComponent(
            value
          )}`
        );
        const searchData = await searchResponse.json();
        const pageIds = searchData.query.search.map(
          (item: SearchResult) => item.pageid
        );

        const imagesResponse = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=pageimages&piprop=thumbnail&pithumbsize=100&pageids=${pageIds.join(
            "|"
          )}`
        );
        const imagesData = await imagesResponse.json();

        const transformedResults = searchData.query.search.map(
          (item: SearchResult) => {
            const pageImage = imagesData.query.pages[item.pageid];
            return {
              title: item.title,
              description: item.snippet.replace(/<\/?[^>]+(>|$)/g, ""),
              thumbnail: pageImage?.thumbnail?.source || "/placeholder.svg",
            };
          }
        );

        setResults(transformedResults);
        setIsOpen(true);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  const handleResultClick = (title: string) => {
    router.push(`/article/${encodeURIComponent(title)}`);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 blur transition-all duration-300" />
        <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-sm transition-transform duration-200 transform group-hover:scale-[1.01] group-focus-within:scale-[1.01]">
          <div className="flex items-center p-1">
            <div className="flex items-center justify-center w-12 h-12">
              {isLoading ? (
                <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
              ) : (
                <SearchIcon className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search Wikipedia..."
              className="flex-1 px-4 py-3 text-lg bg-transparent border-none focus:outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  setResults([]);
                  setIsOpen(false);
                }}
                className="flex items-center justify-center w-12 h-12 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-4 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500">
          <div className="p-6">
            <h3 className="text-sm font-medium text-gray-400 dark:text-gray-500 tracking-wider uppercase mb-4">
              articles
            </h3>
            <div className="space-y-3">
              {results.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleResultClick(result.title)}
                  className="group flex items-start w-full text-left p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  <div className="flex-shrink-0 w-16 h-16 relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <Image
                      src={result.thumbnail || "/placeholder.svg"}
                      alt=""
                      fill
                      sizes="100px"
                      className="object-cover transition-transform duration-200 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1 min-w-0 ml-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                        {result.title}
                      </h4>
                      <ArrowRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {result.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
