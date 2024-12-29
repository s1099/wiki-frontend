'use client'

import { useEffect, useRef } from 'react'

export function ArticleContent({ content }: { content: string }) {
  const articleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (articleRef.current) {
      // Process the content
      const parser = new DOMParser()
      const doc = parser.parseFromString(content, 'text/html')

      // Remove unwanted elements
      doc.querySelectorAll('.mw-editsection').forEach(el => el.remove())

      // Process images
      doc.querySelectorAll('img').forEach(img => {
        if (img.src.startsWith('/')) {
          img.src = `https://en.wikipedia.org${img.src}`
        }
      })

      // Process links
      doc.querySelectorAll('a').forEach(link => {
        if (link.href.startsWith('/wiki/')) {
          link.href = `/article/${link.href.split('/wiki/')[1]}`
        }
      })

      // Apply styles
      const style = document.createElement('style')
      style.textContent = `
        .article-content {
          font-size: 1.125rem;
          line-height: 1.75;
          color: #374151;
        }
        .dark .article-content {
          color: #e5e7eb;
        }
        .article-content h2 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #e5e7eb;
        }
        .dark .article-content h2 {
          border-bottom-color: #4b5563;
        }
        .article-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .article-content p {
          margin-bottom: 1rem;
        }
        .article-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1rem 0;
        }
        .article-content a {
          color: #2563eb;
          text-decoration: none;
        }
        .dark .article-content a {
          color: #60a5fa;
        }
        .article-content a:hover {
          text-decoration: underline;
        }
      `

      articleRef.current.innerHTML = ''
      articleRef.current.appendChild(style)
      articleRef.current.appendChild(doc.body)
    }
  }, [content])

  return <div ref={articleRef} className="article-content prose dark:prose-invert max-w-none" />
}

