"use client";

import { useEffect, useRef } from "react";
import { useArticle } from "../contexts/ArticleContext";
import { ArticleLoader } from "./article-loader";
import { Info } from "lucide-react";

export function ArticleContent() {
  const { articleData, isLoading, error } = useArticle();
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (articleRef.current && articleData?.content) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(articleData.content, "text/html");
      doc.querySelectorAll(".mw-editsection").forEach((el) => el.remove());

      doc.querySelectorAll("img").forEach((img) => {
        if (img.src.startsWith("/")) {
          img.src = `https://en.wikipedia.org${img.src}`;
        }
        img.classList.add("loading-image");
        img.onload = () => img.classList.remove("loading-image");
      });

      doc.querySelectorAll("a").forEach((link) => {
        if (link.href.startsWith("/wiki/")) {
          link.href = `/article/${link.href.split("/wiki/")[1]}`;
          link.classList.add("article-link");
        } else if (link.href.startsWith("http")) {
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          link.classList.add("external-link");
        }
      });

      const style = document.createElement("style");
      style.textContent = `
        .article-content {
          font-size: 1.125rem;
          line-height: 1.8;
          color: #374151;
        }
        
        .dark .article-content {
          color: #e5e7eb;
        }

        .article-content h2 {
          font-size: 2rem;
          font-weight: 700;
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #e5e7eb;
          scroll-margin-top: 5rem;
        }

        .dark .article-content h2 {
          border-bottom-color: #374151;
        }

        .article-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
          scroll-margin-top: 5rem;
        }

        .article-content h4 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          scroll-margin-top: 5rem;
        }

        .article-content p {
          margin-bottom: 1.25rem;
          line-height: 1.8;
        }

        .article-content img {
          max-width: 100%;
          height: auto;
          border-radius: 1rem;
          margin: 2rem auto;
          display: block;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transition: transform 0.3s ease;
        }

        .dark .article-content img {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.18);
        }

        .article-content img:hover {
          transform: scale(1.01);
        }

        .loading-image {
          background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .article-content .article-link {
          color: #2563eb;
          text-decoration: none;
          transition: all 0.2s ease;
          border-bottom: 1px solid transparent;
          padding-bottom: 1px;
        }

        .dark .article-content .article-link {
          color: #60a5fa;
        }

        .article-content .article-link:hover {
          border-bottom-color: currentColor;
        }

        .article-content .external-link {
          color: #059669;
          text-decoration: none;
          transition: all 0.2s ease;
          border-bottom: 1px solid transparent;
          padding-bottom: 1px;
        }

        .dark .article-content .external-link {
          color: #34d399;
        }

        .article-content .external-link:hover {
          border-bottom-color: currentColor;
        }

        .article-content ul, .article-content ol {
          margin: 1.25rem 0;
          padding-left: 1.5rem;
        }

        .article-content li {
          margin-bottom: 0.5rem;
        }

        .article-content blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          margin: 1.5rem 0;
          color: #6b7280;
          font-style: italic;
        }

        .dark .article-content blockquote {
          border-left-color: #4b5563;
          color: #9ca3af;
        }

        .article-content table {
          width: 100%;
          margin: 1.5rem 0;
          border-collapse: collapse;
        }

        .article-content th, .article-content td {
          padding: 0.75rem;
          border: 1px solid #e5e7eb;
        }

        .dark .article-content th, .dark .article-content td {
          border-color: #4b5563;
        }

        .article-content th {
          background-color: #f9fafb;
          font-weight: 600;
        }

        .dark .article-content th {
          background-color: #374151;
        }
      `;

      articleRef.current.innerHTML = "";
      articleRef.current.appendChild(style);
      articleRef.current.appendChild(doc.body);
    }
  }, [articleData?.content]);

  if (isLoading) return <ArticleLoader />;
  if (error)
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-700 dark:text-red-300 flex items-center gap-3">
        <span className="font-medium">Error:</span> {error.message}
      </div>
    );
  if (!articleData) return null;

  return (
    <article className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          {articleData.metadata.title}
        </h1>

        {articleData.metadata.description && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-md">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {articleData.metadata.description}
              </p>
            </div>
          </div>
        )}
      </header>

      <div
        ref={articleRef}
        className="article-content prose dark:prose-invert max-w-none"
      />
    </article>
  );
}
