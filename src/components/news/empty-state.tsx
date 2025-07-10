'use client'

import { FileX, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  type?: 'no-data' | 'no-results'
  onCollectNews?: () => void
}

export function EmptyState({ type = 'no-data', onCollectNews }: EmptyStateProps) {
  if (type === 'no-results') {
    return (
      <div className="col-span-full flex justify-center py-16">
        <div className="content-overlay p-8 text-center max-w-md">
          <FileX className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-800 mb-2">
            검색 결과가 없습니다
          </h3>
          <p className="text-neutral-600 text-sm">
            다른 키워드로 검색해보세요.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="col-span-full flex justify-center py-16">
      <div className="content-overlay p-8 text-center max-w-md">
        <div className="w-16 h-16 bg-gradient-warm-sunset rounded-full flex items-center justify-center mx-auto mb-4">
          <Download className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-neutral-800 mb-2">
          아직 수집된 뉴스가 없습니다
        </h3>
        <p className="text-neutral-600 text-sm mb-6">
          AI Times에서 최신 뉴스를 수집해보세요.
        </p>
        {onCollectNews && (
          <button onClick={onCollectNews} className="btn-primary">
            <Download className="w-4 h-4 mr-2" />
            최신 뉴스 수집하기
          </button>
        )}
      </div>
    </div>
  )
} 