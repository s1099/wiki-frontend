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
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr_350px] gap-8">
            <aside className="hidden lg:block">
              <div className="sticky top-24 transition-all duration-300">
                <Suspense
                  fallback={
                    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                      <ArticleLoader />
                    </div>
                  }
                >
                  <TableOfContents />
                </Suspense>
              </div>
            </aside>

            <main className="min-w-0">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
                <Suspense
                  fallback={
                    <div className="p-8">
                      <ArticleLoader />
                    </div>
                  }
                >
                  <div className="p-8">
                    <ArticleContent />
                  </div>
                </Suspense>
              </div>
            </main>

            <aside className="hidden lg:block">
              <div className="sticky top-24 transition-all duration-300">
                <Suspense
                  fallback={
                    <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                      <ArticleLoader />
                    </div>
                  }
                >
                  <RelatedInfo />
                </Suspense>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </ArticleProvider>
  );
}
