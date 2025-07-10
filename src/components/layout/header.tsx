'use client'

import { Search, Download, Settings, TrendingUp } from 'lucide-react'
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
    <header className="header-artistic">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* 로고 & 브랜드 */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-warm-sunset rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">AI</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent font-montserrat">
              AI Times Dashboard
            </h1>
          </div>

          {/* 검색바 */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 w-4 h-4" />
              <Input
                type="text"
                placeholder="뉴스 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-neutral-200 text-neutral-800 placeholder:text-neutral-500 focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onCollectNews}
              disabled={isCollecting}
              className="btn-primary"
            >
              <Download className="w-4 h-4 mr-2" />
              {isCollecting ? '수집 중...' : '뉴스 수집'}
            </button>
            
            <button
              onClick={onCollectTop10News}
              disabled={isCollectingTop10}
              className="btn-primary"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              {isCollectingTop10 ? '수집 중...' : 'TOP 10'}
            </button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-600 hover:text-primary-600 hover:bg-primary-50"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
} 