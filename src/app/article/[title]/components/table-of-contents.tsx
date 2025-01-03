'use client'

import { useEffect, useState } from 'react'
import { ChevronRight } from 'lucide-react'

interface Section {
  id: string
  title: string
  level: number
}

export function TableOfContents({ content }: { content: string }) {
  const [sections, setSections] = useState<Section[]>([])

  useEffect(() => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    const headings = doc.querySelectorAll('h2, h3, h4')
    
    const extractedSections = Array.from(headings).map((heading) => ({
      id: heading.id,
      title: heading.textContent || '',
      level: parseInt(heading.tagName[1])
    }))

    setSections(extractedSections)
  }, [content])

  return (
    <nav className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Contents</h2>
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-500">
        <ul className="space-y-2">
          {sections.map((section, index) => (
            <li
              key={index}
              className="text-sm"
              style={{ paddingLeft: `${(section.level - 2) * 1}rem` }}
            >
              <a
                href={`#${section.id}`}
                className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 text-gray-600 dark:text-gray-300"
              >
                <ChevronRight className="h-4 w-4 mr-1 flex-shrink-0" />
                <span className="inline-block">{section.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

