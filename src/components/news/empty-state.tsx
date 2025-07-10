'use client'

import { FileX, Download } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  type?: 'no-data' | 'no-results'
  onCollectNews?: () => void
}

export function EmptyState({ type = 'no-data', onCollectNews }: EmptyStateProps) {
  if (type === 'no-results') {
    return (
      <div className="col-span-full flex justify-center py-16">
        <GlassCard className="p-8 text-center max-w-md">
          <FileX className="w-16 h-16 text-neutral-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-0 mb-2">
            검색 결과가 없습니다
          </h3>
          <p className="text-neutral-100 text-sm">
            다른 키워드로 검색해보세요.
          </p>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="col-span-full flex justify-center py-16">
      <GlassCard className="p-8 text-center max-w-md">
        <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Download className="w-8 h-8 text-neutral-100" />
        </div>
        <h3 className="text-lg font-semibold text-neutral-0 mb-2">
          아직 수집된 뉴스가 없습니다
        </h3>
        <p className="text-neutral-100 text-sm mb-6">
          AI Times에서 최신 뉴스를 수집해보세요.
        </p>
        {onCollectNews && (
          <Button onClick={onCollectNews} className="cta-button">
            <Download className="w-4 h-4 mr-2" />
            최신 뉴스 수집하기
          </Button>
        )}
      </GlassCard>
    </div>
  )
} 