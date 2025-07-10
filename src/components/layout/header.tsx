'use client'

import { Search, Download, Settings, TrendingUp } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useDebouncedCallback } from 'use-debounce'

interface HeaderProps {
  onCollectNews: () => void
  onCollectTop10News: () => void
  isCollecting: boolean
  isCollectingTop10: boolean
}

export function Header({ onCollectNews, onCollectTop10News, isCollecting, isCollectingTop10 }: HeaderProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '')

  const debouncedSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set('query', value)
    } else {
      params.delete('query')
    }
    router.push(`/?${params.toString()}`)
  }, 300)

  useEffect(() => {
    debouncedSearch(searchQuery)
  }, [searchQuery, debouncedSearch])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4">
        <GlassCard className="flex items-center justify-between p-4">
          {/* 로고 */}
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-neutral-0 font-montserrat">
              AI Times Dashboard
            </h1>
          </div>

          {/* 검색바 */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-100 w-4 h-4" />
              <Input
                type="text"
                placeholder="뉴스 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-bar pl-10 bg-primary-700/40 border-white/20 text-neutral-0 placeholder:text-neutral-100"
              />
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex items-center space-x-3">
            <Button
              onClick={onCollectNews}
              disabled={isCollecting}
              className="cta-button"
            >
              <Download className="w-4 h-4 mr-2" />
              {isCollecting ? '수집 중...' : '최신 뉴스 수집'}
            </Button>
            
            <Button
              onClick={onCollectTop10News}
              disabled={isCollectingTop10}
              className="cta-button bg-accent-600 hover:bg-accent-700"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              {isCollectingTop10 ? '수집 중...' : 'TOP 10 뉴스 수집'}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-100 hover:text-neutral-0 hover:bg-primary-700/40"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </GlassCard>
      </div>
    </header>
  )
} 