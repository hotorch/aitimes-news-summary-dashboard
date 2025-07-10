import { NextRequest, NextResponse } from 'next/server'

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

// 모든 HTTP 메서드 처리 - 디버깅용
export async function GET(request: NextRequest) {
  return handleAnyRequest(request, 'GET')
}

export async function POST(request: NextRequest) {
  return handleAnyRequest(request, 'POST')
}

export async function PUT(request: NextRequest) {
  return handleAnyRequest(request, 'PUT')
}

export async function DELETE(request: NextRequest) {
  return handleAnyRequest(request, 'DELETE')
}

async function handleAnyRequest(request: NextRequest, method: string) {
  try {
    console.log(`=== ${method} 요청 디버깅 ===`)
    console.log('URL:', request.url)
    console.log('Method:', request.method)
    
    // 헤더 로깅
    const headers = Object.fromEntries(request.headers.entries())
    console.log('Headers:', JSON.stringify(headers, null, 2))
    
    // 쿼리 파라미터 로깅
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())
    console.log('Query Params:', JSON.stringify(queryParams, null, 2))
    
    // 바디 로깅 (GET 요청이 아닌 경우)
    let body = null
    if (method !== 'GET' && request.body) {
      try {
        body = await request.json()
        console.log('Body:', JSON.stringify(body, null, 2))
      } catch (error) {
        console.log('Body parsing failed:', error)
        // 텍스트로 다시 시도
        const text = await request.text()
        console.log('Body (as text):', text)
      }
    }
    
    return NextResponse.json({
      success: true,
      debug: {
        method: method,
        url: request.url,
        headers: headers,
        queryParams: queryParams,
        body: body,
        timestamp: new Date().toISOString()
      }
    }, { headers: corsHeaders })
    
  } catch (error) {
    console.error('테스트 웹훅 오류:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      debug: {
        method: method,
        timestamp: new Date().toISOString()
      }
    }, { status: 500, headers: corsHeaders })
  }
} 