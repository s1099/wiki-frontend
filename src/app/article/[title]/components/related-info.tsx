"use client";

import { useArticle } from "../contexts/ArticleContext";

export interface RelatedArticle {
  title: string;
}

export function RelatedInfo() {
  const { articleData, isLoading, error } = useArticle();

  if (isLoading) return <div>Loading related info...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!articleData) return null;

  const { metadata } = articleData;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-3">
      {metadata.thumbnail && (
        <img
          src={metadata.thumbnail.source}
          alt={metadata.title}
          className="w-full h-auto rounded-xl mb-4"
        />
      )}

      {/* Info box */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
          Quick Facts
        </h3>
        <dl className="space-y-2 text-sm">
          {metadata.extract_html && (
            <div>
              <dt className="font-medium text-gray-900 dark:text-white">
                Overview
              </dt>
              <dd
                className="text-gray-600 dark:text-gray-300 mt-1"
                dangerouslySetInnerHTML={{ __html: metadata.extract_html }}
              />
            </div>
          )}
        </dl>
      </div>

      {/* Related pages */}
      {metadata.related && (
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
            Related Articles
          </h3>
          <ul className="space-y-2">
            {metadata.related.map((item: RelatedArticle, index: number) => (
              <li key={index}>
                <a
                  href={`/article/${encodeURIComponent(item.title)}`}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
