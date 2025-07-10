import { NextRequest, NextResponse } from 'next/server'
import { newsService } from '@/lib/supabase'

// CORS 헤더 설정
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// OPTIONS 요청 처리 (CORS 프리플라이트)
export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  })
}

export async function POST(request: NextRequest) {
  try {
    const { articleId } = await request.json()
    
    if (!articleId) {
      return NextResponse.json(
        { success: false, message: '기사 ID가 필요합니다' },
        { status: 400, headers: corsHeaders }
      )
    }
    
    console.log('요약 생성 시작:', { articleId })
    
    // 먼저 기사 정보를 데이터베이스에서 가져오기
    const article = await newsService.getById(articleId)
    
    if (!article) {
      return NextResponse.json(
        { success: false, message: '기사를 찾을 수 없습니다' },
        { status: 404, headers: corsHeaders }
      )
    }
    
    // Make.com 웹훅 URL (하드코딩)
    const webhookUrl = 'https://hook.eu2.make.com/op3miyerjwry9yjshwrh8ks8xdudyzg0'
    
    // Make.com으로 전송할 JSON 데이터 구성
    const webhookPayload = {
      id: article.id,           // supabase id값
      url: article.url,         // 기사 URL
      title: article.title,     // 기사 제목
      content: article.content  // 기사 본문 내용
    }
    
    console.log('Make.com 웹훅 호출:', { 
      webhookUrl, 
      articleId: article.id,
      title: article.title,
      contentLength: article.content?.length || 0
    })
    
    // Make.com 웹훅으로 데이터 전송
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload),
    })
    
    if (!webhookResponse.ok) {
      throw new Error(`Make.com 웹훅 호출 실패: ${webhookResponse.status} ${webhookResponse.statusText}`)
    }
    
    const webhookResult = await webhookResponse.text()
    console.log('Make.com 응답:', webhookResult)
    
    return NextResponse.json({
      success: true,
      message: '요약 요청이 성공적으로 전송되었습니다. Make.com에서 처리 후 요약이 업데이트됩니다.',
      data: { 
        articleId: article.id,
        title: article.title,
        webhookSent: true 
      }
    }, { headers: corsHeaders })
    
  } catch (error) {
    console.error('요약 생성 API 오류:', error)
    
    return NextResponse.json(
      {
        success: false,
        message: '요약 생성 중 오류가 발생했습니다',
        error: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500, headers: corsHeaders }
    )
  }
}

// Make.com에서 요약 완료 후 호출하는 콜백 엔드포인트
export async function PUT(request: NextRequest) {
  try {
    console.log('PUT /api/summarize 요청 시작')
    console.log('환경 변수 확인:', {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    })
    
    const requestBody = await request.json()
    console.log('요청 본문 (상세):', JSON.stringify(requestBody, null, 2))
    console.log('Request headers:', JSON.stringify(Object.fromEntries(request.headers.entries()), null, 2))
    
    const { articleId, summary } = requestBody
    
    console.log('추출된 데이터:', {
      articleId: articleId,
      articleIdType: typeof articleId,
      articleIdLength: articleId?.length,
      summaryLength: summary?.length,
      summaryType: typeof summary
    })
    
    if (!articleId || !summary) {
      console.log('필수 파라미터 누락:', { articleId: !!articleId, summary: !!summary })
      return NextResponse.json(
        { success: false, message: '기사 ID와 요약이 필요합니다' },
        { status: 400, headers: corsHeaders }
      )
    }
    
    console.log('요약 업데이트 시작:', { 
      articleId, 
      summaryLength: summary.length,
      summaryPreview: summary.substring(0, 100) + '...'
    })
    
    // Supabase 연결 테스트
    try {
      console.log('Supabase 연결 테스트 중...')
      const testQuery = await newsService.getById(articleId)
      console.log('기사 조회 성공:', { 
        found: !!testQuery, 
        title: testQuery?.title?.substring(0, 50) 
      })
      
      if (!testQuery) {
        console.log('기사를 찾을 수 없음:', articleId)
        return NextResponse.json(
          { success: false, message: '해당 ID의 기사를 찾을 수 없습니다' },
          { status: 404, headers: corsHeaders }
        )
      }
    } catch (testError) {
      console.error('Supabase 연결 테스트 실패:', testError)
      
      // Supabase 에러 타입별 처리
      if (testError && typeof testError === 'object' && 'code' in testError) {
        const supabaseError = testError as any
        if (supabaseError.code === 'PGRST116') {
          // 데이터가 없는 경우
          return NextResponse.json(
            { success: false, message: '해당 ID의 기사를 찾을 수 없습니다' },
            { status: 404, headers: corsHeaders }
          )
        }
      }
      
      throw new Error(`데이터베이스 연결 실패: ${testError instanceof Error ? testError.message : '알 수 없는 오류'}`)
    }
    
    try {
      const updatedArticle = await newsService.updateSummary(articleId, summary)
      console.log('요약 업데이트 성공:', { articleId: updatedArticle.id })
      
      return NextResponse.json({
        success: true,
        message: '요약이 성공적으로 저장되었습니다',
        data: { articleId: updatedArticle.id }
      }, { headers: corsHeaders })
      
    } catch (updateError) {
      console.error('요약 업데이트 실패:', updateError)
      
      // Supabase 에러 타입별 처리
      if (updateError && typeof updateError === 'object' && 'code' in updateError) {
        const supabaseError = updateError as any
        if (supabaseError.code === 'PGRST116') {
          // 업데이트할 데이터가 없는 경우
          return NextResponse.json(
            { success: false, message: '해당 ID의 기사를 찾을 수 없거나 업데이트할 수 없습니다' },
            { status: 404, headers: corsHeaders }
          )
        }
      }
      
      throw updateError
    }
  } catch (error) {
    console.error('요약 업데이트 API 오류 (상세):', {
      error,
      message: error instanceof Error ? error.message : '알 수 없는 오류',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })
    
          return NextResponse.json(
        {
          success: false,
          message: '요약 업데이트 중 오류가 발생했습니다',
          error: error instanceof Error ? error.message : '알 수 없는 오류',
          debug: {
            hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            timestamp: new Date().toISOString()
          }
        },
        { status: 500, headers: corsHeaders }
      )
  }
} 