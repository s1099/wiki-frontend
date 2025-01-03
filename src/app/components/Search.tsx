"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { SearchIcon, X } from "lucide-react";

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
  const router = useRouter();

  // const handleSearch = async (value: string) => {
  //   setQuery(value)
  //   if (value.trim()) {
  //     // Example API call - replace with actual Wikipedia API
  //     const response = await fetch(
  //       `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=search&srsearch=${encodeURIComponent(
  //         value
  //       )}&prop=pageimages|description&piprop=thumbnail&pithumbsize=100&prop=pageimages`
  //     )
  //     const data = await response.json()
  //     // Transform the data to match our interface
  //     const transformedResults = data.query.search.map((item: any) => ({
  //       title: item.title,
  //       description: item.snippet.replace(/<\/?[^>]+(>|$)/g, ""),
  //       thumbnail: item.thumbnail?.source || 'vercel.svg'
  //     }))
  //     setResults(transformedResults)
  //     setIsOpen(true)
  //   } else {
  //     setResults([])
  //     setIsOpen(false)
  //   }
  // }

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (value.trim()) {
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
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search all of Wikipedia for..."
          className="w-full px-12 py-3 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full focus:border-blue-400 dark:focus:border-blue-300 focus:outline-none focus:ring focus:ring-blue-300 dark:focus:ring-blue-700 focus:ring-opacity-40 transition-all duration-200"
        />
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <X className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
              ARTICLES
            </h3>
            <div className="space-y-4">
              {results.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleResultClick(result.title)}
                  className="flex items-start space-x-4 w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-xl transition-colors"
                >
                  <div className="flex-shrink-0 w-12 h-12 relative rounded-xl overflow-hidden">
                    <Image
                      src={result.thumbnail || "/placeholder.svg"}
                      alt=""
                      fill
                      sizes="100px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {result.title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
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
