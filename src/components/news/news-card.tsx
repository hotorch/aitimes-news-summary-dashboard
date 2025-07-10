'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, FileText, Clock, User } from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { NewsArticle } from '@/lib/database.types'
import Image from 'next/image'

interface NewsCardProps {
  article: NewsArticle
  onViewDetail: (article: NewsArticle) => void
  onSummarize: (articleId: string) => void
  isSummarizing?: boolean
}

export function NewsCard({ 
  article, 
  onViewDetail, 
  onSummarize, 
  isSummarizing = false 
}: NewsCardProps) {
  const hasContent = !!article.content
  const hasSummary = !!article.summary
  const publishedDate = article.published_at 
    ? format(new Date(article.published_at), 'M월 d일 HH:mm', { locale: ko })
    : null

  return (
    <article className="news-card group">
      <div className="card-container">
        {/* 썸네일 영역 */}
        <div className="card-thumbnail">
          {article.thumbnail_url ? (
            <Image
              src={article.thumbnail_url}
              alt={article.title}
              width={300}
              height={200}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gradient-warm-glow flex items-center justify-center">
              <span className="text-white text-4xl font-bold">AI</span>
            </div>
          )}
          <div className="ranking-badge">{article.ranking}</div>
        </div>
        
        {/* 컨텐츠 영역 */}
        <div 
          className="card-content cursor-pointer" 
          onClick={() => onViewDetail(article)}
        >
          <h3 className="card-title">{article.title}</h3>
          
          {/* 메타정보 */}
          <div className="card-meta">
            <div className="flex items-center space-x-4 text-sm">
              {article.author && (
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{article.author}</span>
                </div>
              )}
              
              {publishedDate && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{publishedDate}</span>
                </div>
              )}
            </div>
            
            {/* 상태 배지들 */}
            <div className="flex space-x-2 mt-2">
              {hasSummary && (
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  요약 완료
                </Badge>
              )}
              {hasContent && (
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  본문 있음
                </Badge>
              )}
            </div>
          </div>

          {/* 요약 미리보기 */}
          {article.summary && (
            <p className="text-sm text-neutral-600 line-clamp-3 mb-4">
              {article.summary}
            </p>
          )}
          
          {/* 액션 버튼들 */}
          <div className="card-actions">
            <div className="flex space-x-2 w-full">
              <Button
                className="flex-1 bg-gradient-warm-sunset text-white font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 border-0"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(article.url, '_blank')
                }}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                원문보기
              </Button>

              {!hasSummary && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    onSummarize(article.id)
                  }}
                  disabled={isSummarizing}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-orange-500 text-orange-800 bg-orange-50 hover:bg-orange-100 hover:border-orange-600 hover:text-orange-900 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  {isSummarizing ? '요약 중...' : '요약하기'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
} 