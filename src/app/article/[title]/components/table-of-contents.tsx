"use client";

import { useEffect, useState } from "react";
import { List, ChevronRight, FileText } from "lucide-react";
import { useArticle } from "../contexts/ArticleContext";
import { ArticleLoader } from "./article-loader";

interface Section {
  id: string;
  title: string;
  level: number;
}

export function TableOfContents() {
  const { articleData, isLoading, error } = useArticle();
  const [sections, setSections] = useState<Section[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!articleData?.content) return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(articleData.content, "text/html");
    const headings = doc.querySelectorAll("h2, h3, h4");

    headings.forEach((heading) => {
      if (heading.id) {
        const element = document.getElementById(heading.id);
        if (element) {
          element.style.scrollMarginTop = "65px";
        }
      }
    });

    const extractedSections = Array.from(headings).map((heading) => ({
      id: heading.id,
      title: heading.textContent || "",
      level: parseInt(heading.tagName[1]),
    }));

    setSections(extractedSections);
  }, [articleData?.content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0% -35% 0%",
        threshold: 0,
      }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  if (isLoading) return <ArticleLoader />;
  if (error)
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-700 dark:text-red-300">
        Error: {error.message}
      </div>
    );
  if (!articleData) return null;

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - 65;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center gap-2 mb-3">
        <List className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
          Contents
        </h2>
      </div>

      <div className="relative">
        <div className="absolute left-[1.15rem] top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/0 via-blue-500/20 to-blue-500/0 dark:from-blue-400/0 dark:via-blue-400/20 dark:to-blue-400/0" />

        <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500">
          <ul className="space-y-0.5">
            {sections.map((section, index) => {
              const isActive = section.id === activeId;

              return (
                <li
                  key={index}
                  className={`
                    text-sm transition-all duration-200
                    ${section.level === 2 ? "mt-1.5 first:mt-0" : ""}
                  `}
                  style={{
                    paddingLeft: `${(section.level - 2) * 1}rem`,
                  }}
                >
                  <a
                    href={`#${section.id}`}
                    className={`
                      group flex items-center py-1 px-2 rounded-md
                      hover:bg-blue-50 dark:hover:bg-blue-900/20
                      ${
                        isActive
                          ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                          : "text-gray-600 dark:text-gray-300"
                      }
                      transition-all duration-200
                    `}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(section.id);
                    }}
                  >
                    <ChevronRight
                      className={`
                        h-3 w-3 mr-1.5 flex-shrink-0 transition-transform duration-200
                        ${
                          isActive
                            ? "translate-x-0.5"
                            : "group-hover:translate-x-0.5"
                        }
                      `}
                    />
                    <span className="inline-block text-xs leading-5">
                      {section.title}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {sections.length === 0 && (
        <div className="flex items-center justify-center py-4 text-gray-400 dark:text-gray-500">
          <FileText className="w-4 h-4 mr-1.5" />
          <span className="text-xs">No sections found</span>
        </div>
      )}
    </nav>
  );
}
