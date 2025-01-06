"use client";

import Image from "next/image";
import { useArticle } from "../contexts/ArticleContext";
import { ArticleLoader } from "./article-loader";
import { ExternalLink, BookOpen, Info } from "lucide-react";

export interface RelatedArticle {
  title: string;
}

export function RelatedInfo() {
  const { articleData, isLoading, error } = useArticle();

  if (isLoading) return <ArticleLoader />;
  if (error)
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-700 dark:text-red-300">
        Error: {error.message}
      </div>
    );
  if (!articleData) return null;

  const { metadata } = articleData;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
      {metadata.thumbnail && (
        <div className="relative h-64 mb-6 rounded-xl overflow-hidden">
          <Image
            src={metadata.thumbnail.source}
            alt={metadata.title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 hover:scale-105"
          />
        </div>
      )}

      <div className="bg-gray-50 dark:bg-gray-700/50 backdrop-blur rounded-xl p-6 mb-6 transition-all duration-300 hover:shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Quick Facts
          </h3>
        </div>

        <dl className="space-y-4">
          {metadata.extract_html && (
            <div className="relative">
              <dt className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                Overview
              </dt>
              <dd
                className="text-gray-600 dark:text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: metadata.extract_html }}
              />
            </div>
          )}
        </dl>
      </div>

      {/* Related Articles */}
      {metadata.related && (
        <div className="bg-gray-50 dark:bg-gray-700/50 backdrop-blur rounded-xl p-6 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <ExternalLink className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Related Articles
            </h3>
          </div>

          <ul className="grid gap-2">
            {metadata.related.map((item: RelatedArticle, index: number) => (
              <li key={index} className="group transition-all duration-300">
                <a
                  href={`/article/${encodeURIComponent(item.title)}`}
                  className="flex items-center gap-2 p-3 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-300"
                >
                  <span className="text-sm group-hover:underline">
                    {item.title}
                  </span>
                  <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
