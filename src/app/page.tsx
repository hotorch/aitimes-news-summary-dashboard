'use client'

import { useState, Suspense, useCallback } from 'react'
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

  // 공통 뉴스 수집 함수
  const createCollectionMutation = useCallback((endpoint: string, successMessage: string) => {
    return useMutation({
      mutationFn: async () => {
        const log = await collectionService.create({
          started_at: new Date().toISOString(),
          total_articles: 10
        })

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ logId: log.id }),
        })

        if (!response.ok) {
          throw new Error(`${successMessage} 수집에 실패했습니다`)
        }

        return response.json()
      },
      onSuccess: () => {
        toast({
          title: `${successMessage} 수집 완료`,
          description: `AI Times에서 ${successMessage}를 성공적으로 수집했습니다.`,
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
  }, [toast, queryClient])

  // 뉴스 수집 뮤테이션들
  const collectNewsMutation = createCollectionMutation('/api/collect-news', '최신 뉴스')
  const collectTop10NewsMutation = createCollectionMutation('/api/collect-top10-news', 'TOP 10 뉴스')

  // 요약 생성 뮤테이션
  const summarizeMutation = useMutation({
    mutationFn: async (articleId: string) => {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId }),
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

  // 이벤트 핸들러들
  const handleCollectNews = useCallback(() => collectNewsMutation.mutate(), [collectNewsMutation])
  const handleCollectTop10News = useCallback(() => collectTop10NewsMutation.mutate(), [collectTop10NewsMutation])
  const handleViewDetail = useCallback((article: NewsArticle) => setSelectedArticle(article), [])
  const handleSummarize = useCallback((articleId: string) => summarizeMutation.mutate(articleId), [summarizeMutation])
  const handleCloseModal = useCallback(() => setSelectedArticle(null), [])

  const showEmptyState = !isLoading && articles.length === 0
  const emptyStateType = query ? 'no-results' : 'no-data'

  return (
    <div className="background-system">
      <div className="relative z-10">
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
      </div>

      <NewsDetailModal
        article={selectedArticle}
        isOpen={!!selectedArticle}
        onClose={handleCloseModal}
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500 mx-auto"></div>
          <p className="text-neutral-100 mt-4 text-center">로딩 중...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
