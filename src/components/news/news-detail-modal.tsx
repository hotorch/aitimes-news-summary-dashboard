'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ExternalLink, FileText, Clock, User, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { NewsArticle } from '@/lib/database.types'
import Image from 'next/image'

interface NewsDetailModalProps {
  article: NewsArticle | null
  isOpen: boolean
  onClose: () => void
  onSummarize: (articleId: string) => void
  isSummarizing?: boolean
}

export function NewsDetailModal({
  article,
  isOpen,
  onClose,
  onSummarize,
  isSummarizing = false
}: NewsDetailModalProps) {
  if (!article) return null

  const hasContent = !!article.content
  const hasSummary = !!article.summary
  const publishedDate = article.published_at 
    ? format(new Date(article.published_at), 'yyyy년 M월 d일 HH:mm', { locale: ko })
    : null
  const createdDate = article.created_at
    ? format(new Date(article.created_at), 'yyyy년 M월 d일 HH:mm', { locale: ko })
    : null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-primary-700/95 backdrop-blur-md border-white/10 text-neutral-0 overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold text-neutral-0 mb-2">
                {article.title}
              </DialogTitle>
              <DialogDescription className="text-neutral-100">
                AI Times 뉴스 상세 정보
              </DialogDescription>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge 
                variant="secondary" 
                className="bg-accent-from/20 text-accent-to border-accent-to/30"
              >
                순위 #{article.ranking}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* 썸네일 */}
          {article.thumbnail_url && (
            <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-primary-900">
              <Image
                src={article.thumbnail_url}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
            </div>
          )}

          {/* 메타정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-neutral-100">
            {article.author && (
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>작성자: {article.author}</span>
              </div>
            )}
            
            {publishedDate && (
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>발행일: {publishedDate}</span>
              </div>
            )}
            
            {createdDate && (
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>수집일: {createdDate}</span>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>본문: {hasContent ? '있음' : '없음'}</span>
            </div>
          </div>

          {/* 상태 배지들 */}
          <div className="flex flex-wrap gap-2">
            {hasSummary && (
              <Badge variant="outline" className="text-green-400 border-green-400/30">
                요약 완료
              </Badge>
            )}
            {hasContent && (
              <Badge variant="outline" className="text-blue-400 border-blue-400/30">
                본문 있음
              </Badge>
            )}
            {article.summary_created_at && (
              <Badge variant="outline" className="text-purple-400 border-purple-400/30">
                요약 생성: {format(new Date(article.summary_created_at), 'M월 d일 HH:mm', { locale: ko })}
              </Badge>
            )}
          </div>

          <Separator className="bg-white/10" />

          {/* 요약 내용 */}
          {article.summary && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-neutral-0">AI 요약</h3>
              <div className="bg-primary-900/50 rounded-lg p-4 border border-white/10">
                <p className="text-neutral-100 leading-relaxed whitespace-pre-wrap">
                  {article.summary}
                </p>
              </div>
            </div>
          )}

          {/* 본문 내용 */}
          {article.content && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-neutral-0">본문 내용</h3>
              <div className="bg-primary-900/50 rounded-lg p-4 border border-white/10 max-h-96 overflow-y-auto">
                <div 
                  className="text-neutral-100 leading-relaxed prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              </div>
            </div>
          )}

          {/* 액션 버튼들 */}
          <div className="flex flex-wrap gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1 border-white/20 text-neutral-100 hover:bg-primary-700/40"
              onClick={() => window.open(article.url, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              AI Times에서 읽기
            </Button>

            {!hasSummary && (
              <Button
                onClick={() => onSummarize(article.id)}
                disabled={isSummarizing}
                className="cta-button flex-1"
              >
                <FileText className="w-4 h-4 mr-2" />
                {isSummarizing ? '요약 생성 중...' : 'AI 요약 생성'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 