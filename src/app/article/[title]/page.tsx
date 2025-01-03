import { notFound } from 'next/navigation'
import { TableOfContents } from './components/table-of-contents'
import { ArticleContent } from './components/article-content'
import { RelatedInfo } from './components/related-info'
import { Header } from '@/app/components/Header'

async function getArticle(title: string) {
  const response = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(title)}`
  )

  if (!response.ok) {
    notFound()
  }

  return response.text()
}

async function getMetadata(title: string) {
  const response = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
  )

  if (!response.ok) {
    notFound()
  }

  return response.json()
}

export default async function ArticlePage({ params }: { params: Promise<{ title: string }> }) {
  const paramsData = await params;
  const title = decodeURIComponent(paramsData.title);

  const [content, metadata] = await Promise.all([
    getArticle(title),
    getMetadata(title),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_350px] gap-8">
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <TableOfContents content={content} />
            </div>
          </div>
          <main className="min-w-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{metadata.title}</h1>
              {metadata.description && (
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  {metadata.description}
                </p>
              )}
              <ArticleContent content={content} />
            </div>
          </main>
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <RelatedInfo metadata={metadata} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

