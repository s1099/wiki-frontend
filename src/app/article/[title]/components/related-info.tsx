interface Metadata {
  thumbnail?: {
    source: string;
  };
  title: string;
  extract_html?: string;
  related?: Array<{
    title: string;
  }>;
}

export function RelatedInfo({ metadata }: { metadata: Metadata }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3">
      {metadata.thumbnail && (
        <img
          src={metadata.thumbnail.source}
          alt={metadata.title}
          className="w-full h-auto rounded-lg mb-4"
        />
      )}

      {/* Info box */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Quick Facts</h3>
        <dl className="space-y-2 text-sm">
          {metadata.extract_html && (
            <div>
              <dt className="font-medium text-gray-900 dark:text-white">Overview</dt>
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
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Related Articles</h3>
          <ul className="space-y-2">
            {metadata.related.map((item, index: number) => (
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
  )
}

