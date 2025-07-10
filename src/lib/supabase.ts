import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL이나 Anon Key가 설정되지 않았습니다')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // 개인용 도구이므로 세션 유지 불필요
  },
})

// 뉴스 기사 관련 함수들
export const newsService = {
  // 모든 뉴스 기사 조회 (최신순)
  async getAll() {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .order('created_at', { ascending: false })
      .order('ranking', { ascending: true })
    
    if (error) throw error
    return data
  },

  // 최신 수집된 뉴스 조회 (순위별)
  async getLatestBatch() {
    // 가장 최근 수집 시간을 먼저 구함
    const { data: latest } = await supabase
      .from('news_articles')
      .select('created_at')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    
    if (!latest) return []
    
    // 해당 시간대의 뉴스들 조회
    const latestDate = new Date(latest.created_at!).toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .gte('created_at', latestDate)
      .order('ranking', { ascending: true })
    
    if (error) throw error
    return data
  },

  // 특정 뉴스 기사 조회
  async getById(id: string) {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // 검색
  async search(query: string) {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .or(`title.ilike.%${query}%,summary.ilike.%${query}%`)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // 요약 업데이트
  async updateSummary(id: string, summary: string) {
    const { data, error } = await supabase
      .from('news_articles')
      .update({ 
        summary, 
        summary_created_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// 수집 로그 관련 함수들
export const collectionService = {
  // 수집 로그 생성
  async create(data: { started_at: string; total_articles?: number }) {
    const { data: log, error } = await supabase
      .from('collection_logs')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return log
  },

  // 수집 완료 업데이트
  async complete(id: string, data: { 
    completed_at: string
    success_count: number
    failed_count: number
    error_details?: any
  }) {
    const { data: log, error } = await supabase
      .from('collection_logs')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return log
  },

  // 최근 수집 로그들 조회
  async getRecent(limit = 10) {
    const { data, error } = await supabase
      .from('collection_logs')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data
  }
} 