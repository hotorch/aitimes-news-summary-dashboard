import { NextRequest, NextResponse } from 'next/server'
import { collectAllNews } from '@/lib/scraping'
import { getSupabaseClient, collectionService } from '@/lib/supabase'
import type { NewsArticleInsert } from '@/lib/database.types'

export async function POST(request: NextRequest) {
  try {
    const { logId } = await request.json()
    
    console.log('뉴스 수집 시작...', { logId })
    
    // 1. 뉴스 스크래핑 실행
    const scrapingResult = await collectAllNews()
    
    // 2. Supabase에 뉴스 저장
    const supabase = getSupabaseClient()
    const savedArticles = []
    const errors = [...scrapingResult.errors]
    
    for (const article of scrapingResult.articles) {
      try {
        // 중복 URL 체크 (ON CONFLICT 처리)
        const articleData: NewsArticleInsert = {
          url: article.url,
          ranking: article.ranking,
          title: article.title,
          content: article.content || null,
          thumbnail_url: article.thumbnail_url || null,
          author: article.author || null,
          published_at: article.published_at || null,
        }
        
        const { data, error } = await supabase
          .from('news_articles')
          .upsert(articleData, { 
            onConflict: 'url',
            ignoreDuplicates: false 
          })
          .select()
        
        if (error) {
          console.error('기사 저장 실패:', error)
          errors.push(`기사 저장 실패 (${article.title}): ${error.message}`)
        } else if (data) {
          savedArticles.push(...data)
        }
        
      } catch (error) {
        console.error('기사 처리 중 오류:', error)
        errors.push(`기사 처리 오류 (${article.title}): ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
      }
    }
    
    // 3. 수집 로그 업데이트
    if (logId) {
      try {
        await collectionService.complete(logId, {
          completed_at: new Date().toISOString(),
          success_count: savedArticles.length,
          failed_count: scrapingResult.articles.length - savedArticles.length,
          error_details: errors.length > 0 ? { errors } : null
        })
      } catch (error) {
        console.error('로그 업데이트 실패:', error)
      }
    }
    
    console.log(`수집 완료: ${savedArticles.length}개 저장, ${errors.length}개 오류`)
    
    return NextResponse.json({
      success: true,
      message: `뉴스 수집 완료: ${savedArticles.length}개 저장`,
      data: {
        total_scraped: scrapingResult.articles.length,
        saved_count: savedArticles.length,
        error_count: errors.length,
        errors: errors.length > 0 ? errors : undefined
      }
    })
    
  } catch (error) {
    console.error('뉴스 수집 API 오류:', error)
    
    // 로그 오류 업데이트 시도
    try {
      const { logId } = await request.json()
      if (logId) {
        await collectionService.complete(logId, {
          completed_at: new Date().toISOString(),
          success_count: 0,
          failed_count: 10,
          error_details: { 
            errors: [error instanceof Error ? error.message : '알 수 없는 오류'] 
          }
        })
      }
    } catch (logError) {
      console.error('로그 오류 업데이트 실패:', logError)
    }
    
    return NextResponse.json(
      {
        success: false,
        message: '뉴스 수집 중 오류가 발생했습니다',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    )
  }
} 