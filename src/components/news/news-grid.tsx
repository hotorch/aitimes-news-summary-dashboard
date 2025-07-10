'use client'

import { NewsCard } from './news-card'
import type { NewsArticle } from '@/lib/database.types'
import { EmptyState } from './empty-state'

interface NewsGridProps {
  articles: NewsArticle[]
  onViewDetail: (article: NewsArticle) => void
  onSummarize: (articleId: string) => void
  summarizingId?: string
  isLoading?: boolean
}

export function NewsGrid({ 
  articles, 
  onViewDetail, 
  onSummarize, 
  summarizingId,
  isLoading 
}: NewsGridProps) {
  if (isLoading) {
    return (
      <div className="news-grid">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="news-card animate-pulse">
            <div className="h-48 bg-neutral-200 rounded-t-xl"></div>
            <div className="p-6 space-y-4">
              <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-neutral-200 rounded"></div>
                <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
              </div>
              <div className="flex space-x-2">
                <div className="h-8 bg-neutral-200 rounded flex-1"></div>
                <div className="h-8 bg-neutral-200 rounded flex-1"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (articles.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="news-grid">
      {articles.map((article) => (
        <NewsCard
          key={article.id}
          article={article}
          onViewDetail={onViewDetail}
          onSummarize={onSummarize}
          isSummarizing={summarizingId === article.id}
        />
      ))}
    </div>
  )
} 