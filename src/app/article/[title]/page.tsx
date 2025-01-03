import { TableOfContents } from "./components/table-of-contents";
import { ArticleContent } from "./components/article-content";
import { RelatedInfo } from "./components/related-info";
import { Header } from "@/app/components/Header";
import { ArticleProvider } from "./contexts/ArticleContext";
import { Suspense } from "react";
import { ArticleLoader } from "./components/article-loader";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ title: string }>;
}) {
  const paramsData = await params;
  const title = decodeURIComponent(paramsData.title);

  return (
    <ArticleProvider title={title}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_350px] gap-8">
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <Suspense fallback={<div>Loading contents...</div>}>
                  <TableOfContents />
                </Suspense>
              </div>
            </div>
            <main className="min-w-0">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
                <Suspense fallback={<ArticleLoader />}>
                  <ArticleContent />
                </Suspense>
              </div>
            </main>
            <div className="hidden lg:block">
              <div className="sticky top-24">
                <Suspense fallback={<div>Loading related info...</div>}>
                  <RelatedInfo />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ArticleProvider>
  );
}
