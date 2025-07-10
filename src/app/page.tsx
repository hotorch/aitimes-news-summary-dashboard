'use client'

import { useState, Suspense } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { NewsGrid } from '@/components/news/news-grid'
import { NewsDetailModal } from '@/components/news/news-detail-modal'
import { EmptyState } from '@/components/news/empty-state'
import { useToast } from '@/hooks/use-toast'
import { newsService, collectionService } from '@/lib/supabase'
import type { NewsArticle } from '@/lib/database.types'

function DashboardContent() {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)
  const [summarizingId, setSummarizingId] = useState<string>()
  const searchParams = useSearchParams()
  const query = searchParams.get('query') || ''
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // 뉴스 데이터 조회
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['news', query],
    queryFn: async () => {
      if (query) {
        return await newsService.search(query)
      }
      return await newsService.getLatestBatch()
    },
    staleTime: 2 * 60 * 1000, // 2분
  })

  // 최신 뉴스 수집 뮤테이션
  const collectNewsMutation = useMutation({
    mutationFn: async () => {
      // 수집 로그 시작
      const log = await collectionService.create({
        started_at: new Date().toISOString(),
        total_articles: 10
      })

      const response = await fetch('/api/collect-news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logId: log.id }),
      })

      if (!response.ok) {
        throw new Error('최신 뉴스 수집에 실패했습니다')
      }

      return response.json()
    },
    onSuccess: () => {
      toast({
        title: '최신 뉴스 수집 완료',
        description: 'AI Times에서 최신 뉴스를 성공적으로 수집했습니다.',
      })
      queryClient.invalidateQueries({ queryKey: ['news'] })
    },
    onError: (error) => {
      toast({
        title: '수집 실패',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  // TOP 10 뉴스 수집 뮤테이션
  const collectTop10NewsMutation = useMutation({
    mutationFn: async () => {
      // 수집 로그 시작
      const log = await collectionService.create({
        started_at: new Date().toISOString(),
        total_articles: 10
      })

      const response = await fetch('/api/collect-top10-news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logId: log.id }),
      })

      if (!response.ok) {
        throw new Error('TOP 10 뉴스 수집에 실패했습니다')
      }

      return response.json()
    },
    onSuccess: () => {
      toast({
        title: 'TOP 10 뉴스 수집 완료',
        description: 'AI Times에서 인기 TOP 10 뉴스를 성공적으로 수집했습니다.',
      })
      queryClient.invalidateQueries({ queryKey: ['news'] })
    },
    onError: (error) => {
      toast({
        title: 'TOP 10 수집 실패',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  // 요약 생성 뮤테이션
  const summarizeMutation = useMutation({
    mutationFn: async (articleId: string) => {
      // Make.com webhook 호출 - articleId만 전송하면 API에서 데이터베이스에서 조회
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          articleId: articleId
        }),
      })

      if (!response.ok) {
        throw new Error('요약 생성에 실패했습니다')
      }

      return response.json()
    },
    onMutate: (articleId) => {
      setSummarizingId(articleId)
    },
    onSuccess: () => {
      toast({
        title: '요약 요청 전송 완료',
        description: 'Make.com으로 요약 요청이 전송되었습니다. 잠시 후 요약이 업데이트됩니다.',
      })
      queryClient.invalidateQueries({ queryKey: ['news'] })
    },
    onError: (error) => {
      toast({
        title: '요약 실패',
        description: error.message,
        variant: 'destructive',
      })
    },
    onSettled: () => {
      setSummarizingId(undefined)
    },
  })

  const handleCollectNews = () => {
    collectNewsMutation.mutate()
  }

  const handleCollectTop10News = () => {
    collectTop10NewsMutation.mutate()
  }

  const handleViewDetail = (article: NewsArticle) => {
    setSelectedArticle(article)
  }

  const handleSummarize = (articleId: string) => {
    summarizeMutation.mutate(articleId)
  }

  const showEmptyState = !isLoading && articles.length === 0
  const emptyStateType = query ? 'no-results' : 'no-data'

  return (
    <div className="min-h-screen bg-primary-900">
      <Header 
        onCollectNews={handleCollectNews}
        onCollectTop10News={handleCollectTop10News}
        isCollecting={collectNewsMutation.isPending}
        isCollectingTop10={collectTop10NewsMutation.isPending}
      />
      
      <main className="container mx-auto px-4 py-8">
        {showEmptyState ? (
          <EmptyState 
            type={emptyStateType}
            onCollectNews={emptyStateType === 'no-data' ? handleCollectNews : undefined}
          />
        ) : (
          <NewsGrid
            articles={articles}
            onViewDetail={handleViewDetail}
            onSummarize={handleSummarize}
            summarizingId={summarizingId}
            isLoading={isLoading}
          />
        )}
      </main>

      <NewsDetailModal
        article={selectedArticle}
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
        onSummarize={handleSummarize}
        isSummarizing={summarizingId === selectedArticle?.id}
      />
    </div>
  )
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-primary-900 flex items-center justify-center">
        <div className="glass-card p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-to mx-auto"></div>
          <p className="text-neutral-100 mt-4 text-center">로딩 중...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
