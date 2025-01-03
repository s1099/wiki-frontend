"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { RelatedArticle } from "../components/related-info";

interface Metadata {
  thumbnail?: {
    source: string;
  };
  title: string;
  extract_html?: string;
  related?: Array<RelatedArticle>;
  description?: string;
}

interface ArticleData {
  content: string;
  metadata: Metadata;
}

interface ArticleContextType {
  articleData: ArticleData | null;
  isLoading: boolean;
  error: Error | null;
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

export function ArticleProvider({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const [articleData, setArticleData] = useState<ArticleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchArticleData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [contentResponse, metadataResponse] = await Promise.all([
          fetch(
            `https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(
              title
            )}`
          ),
          fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
              title
            )}`
          ),
        ]);

        if (!contentResponse.ok || !metadataResponse.ok) {
          throw new Error("Failed to fetch article data");
        }

        const [content, metadata] = await Promise.all([
          contentResponse.text(),
          metadataResponse.json(),
        ]);

        setArticleData({ content, metadata });
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticleData();
  }, [title]);

  return (
    <ArticleContext.Provider value={{ articleData, isLoading, error }}>
      {children}
    </ArticleContext.Provider>
  );
}

export function useArticle() {
  const context = useContext(ArticleContext);
  if (context === undefined) {
    throw new Error("useArticle must be used within an ArticleProvider");
  }
  return context;
}
