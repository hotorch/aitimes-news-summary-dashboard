// AI Times 뉴스 스크래핑 관련 유틸리티

export interface ScrapedNews {
  url: string
  ranking: number
  title: string
  content?: string
  thumbnail_url?: string
  author?: string
  published_at?: string
}

export interface ScrapingResult {
  success_count: number
  failed_count: number
  articles: ScrapedNews[]
  errors: string[]
}

/**
 * AI Times 메인 페이지에서 최신 뉴스 메타정보 추출 (상위 10개)
 */
export async function scrapeNewsMetadata(): Promise<{ url: string; ranking: number; title: string }[]> {
  try {
    const response = await fetch('https://www.aitimes.com/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const html = await response.text()
    
    // 링크와 제목이 함께 있는 구조를 찾기
    // 패턴: <a href="...idxno=123" target="_top"><H2 class="auto-titles">제목</H2></a>
    const combinedPattern = /<a href="https:\/\/www\.aitimes\.com\/news\/articleView\.html\?idxno=(\d+)"[^>]*><H2[^>]*class="auto-titles[^"]*"[^>]*>([^<]+)<\/H2><\/a>/g
    
    const newsItems: { url: string; ranking: number; title: string }[] = []
    let match
    
    while ((match = combinedPattern.exec(html)) !== null && newsItems.length < 10) {
      const [, idxno, title] = match
      newsItems.push({
        url: `https://www.aitimes.com/news/articleView.html?idxno=${idxno}`,
        ranking: newsItems.length + 1, // 순위는 1부터 시작
        title: title.trim()
      })
    }
    
    // 위 패턴으로 찾지 못한 경우 분리된 패턴으로 재시도
    if (newsItems.length === 0) {
      console.log('결합 패턴 실패, 분리 패턴으로 재시도...')
      
      // 모든 기사 링크와 제목을 별도로 추출
      const articleLinkPattern = /href="https:\/\/www\.aitimes\.com\/news\/articleView\.html\?idxno=(\d+)"/g
      const titlePattern = /<H2[^>]*class="auto-titles[^"]*"[^>]*>([^<]+)<\/H2>/g
      
      const articleLinks: string[] = []
      let linkMatch
      while ((linkMatch = articleLinkPattern.exec(html)) !== null && articleLinks.length < 15) {
        const idxno = linkMatch[1]
        articleLinks.push(`https://www.aitimes.com/news/articleView.html?idxno=${idxno}`)
      }
      
      const titles: string[] = []
      let titleMatch
      while ((titleMatch = titlePattern.exec(html)) !== null && titles.length < 15) {
        titles.push(titleMatch[1].trim())
      }
      
      console.log(`발견된 기사 링크: ${articleLinks.length}개`)
      console.log(`발견된 제목: ${titles.length}개`)
      
      // 중복 제거하여 고유한 링크만 유지
      const uniqueLinks = [...new Set(articleLinks)]
      const uniqueTitles = [...new Set(titles)]
      
      // 링크와 제목을 매칭하여 뉴스 아이템 생성
      const maxItems = Math.min(uniqueLinks.length, uniqueTitles.length, 10)
      
      for (let i = 0; i < maxItems; i++) {
        newsItems.push({
          url: uniqueLinks[i],
          ranking: i + 1,
          title: uniqueTitles[i]
        })
      }
    }
    
    console.log(`최종 수집된 뉴스: ${newsItems.length}개`)
    return newsItems
  } catch (error) {
    console.error('메타정보 스크래핑 실패:', error)
    throw error
  }
}

/**
 * 개별 뉴스 기사의 상세 내용 스크래핑
 */
export async function scrapeArticleDetails(url: string): Promise<{
  content: string
  thumbnail_url?: string
  author?: string
  published_at?: string
}> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const html = await response.text()
    
    // 본문 내용 추출 - 개선된 로직으로 전체 본문 추출
    let content = ''
    
    // 패턴 1: 모든 p 태그 추출 (가장 정확한 방법)
    const pTagsRegex = /<p[^>]*>([\s\S]*?)<\/p>/g
    const pTags = []
    let pMatch
    
    while ((pMatch = pTagsRegex.exec(html)) !== null) {
      const pContent = pMatch[1]
      // 빈 p 태그나 너무 짧은 내용 제외
      if (pContent.trim().length > 10) {
        pTags.push(pContent.trim())
      }
    }
    
    if (pTags.length > 0) {
      content = pTags.join('\n\n')
    }
    
    // 패턴 2: article-body나 유사한 컨테이너가 있는 경우
    if (!content) {
      const articleBodyPatterns = [
        /<div[^>]*class="[^"]*article-body[^"]*"[^>]*>([\s\S]*?)<\/div>/,
        /<div[^>]*id="article-view-content-div"[^>]*>([\s\S]*?)<\/div>/,
        /<article[^>]*>([\s\S]*?)<\/article>/,
        /<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/
      ]
      
      for (const pattern of articleBodyPatterns) {
        const match = html.match(pattern)
        if (match) {
          content = match[1]
          break
        }
      }
    }
    
    // HTML 태그 정리 및 텍스트 추출
    if (content) {
      content = content
        .replace(/<script[\s\S]*?<\/script>/gi, '') // 스크립트 제거
        .replace(/<style[\s\S]*?<\/style>/gi, '') // 스타일 제거
        .replace(/<!--[\s\S]*?-->/g, '') // 주석 제거
        .replace(/<figure[\s\S]*?<\/figure>/gi, '') // figure 태그 제거 (이미지 캡션)
        .replace(/<div[^>]*class="[^"]*photo[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '') // 사진 div 제거
        .replace(/<img[^>]*>/gi, '') // img 태그 제거
        .replace(/<a[^>]*href="[^"]*"[^>]*>(.*?)<\/a>/gi, '$1') // 링크는 텍스트만 남김
        .replace(/<[^>]+>/g, '') // 나머지 모든 HTML 태그 제거
        .replace(/&nbsp;/g, ' ') // &nbsp; 변환
        .replace(/&amp;/g, '&') // &amp; 변환
        .replace(/&lt;/g, '<') // &lt; 변환
        .replace(/&gt;/g, '>') // &gt; 변환
        .replace(/&quot;/g, '"') // &quot; 변환
        .replace(/&#39;/g, "'") // &#39; 변환
        .replace(/\s+/g, ' ') // 연속된 공백을 하나로
        .replace(/\n\s*\n/g, '\n\n') // 연속된 줄바꿈 정리
        .trim()
    }

    // 썸네일 이미지 추출
    const thumbnailMatch = html.match(/<meta property="og:image" content="([^"]+)"/) ||
                          html.match(/<img[^>]*src="([^"]*cdn\.aitimes\.com[^"]*)"/) ||
                          html.match(/<img[^>]*src="([^"]*)"[^>]*class="[^"]*thumb[^"]*"/)
    const thumbnail_url = thumbnailMatch ? thumbnailMatch[1] : undefined

    // 작성자 추출
    const authorMatch = html.match(/<span[^>]*class="[^"]*writer[^"]*"[^>]*>([^<]+)<\/span>/) ||
                       html.match(/기자[:\s]*([^<\s\n]+)/) ||
                       html.match(/작성자[:\s]*([^<\s\n]+)/) ||
                       html.match(/by\s+([^<\s\n]+)/i)
    const author = authorMatch ? authorMatch[1].trim() : undefined

    // 발행일시 추출
    const dateMatch = html.match(/<time[^>]*datetime="([^"]+)"/) || 
                     html.match(/(\d{4}-\d{2}-\d{2}[\sT]\d{2}:\d{2}:\d{2})/) ||
                     html.match(/발행일[:\s]*(\d{4}-\d{2}-\d{2}[\s\d:]+)/) ||
                     html.match(/등록[:\s]*(\d{4}-\d{2}-\d{2}[\s\d:]+)/)
    const published_at = dateMatch ? dateMatch[1] : undefined

    console.log(`기사 본문 추출 결과: ${content.length}자 (URL: ${url})`)

    return {
      content: content || '본문 내용을 추출할 수 없습니다.',
      thumbnail_url,
      author,
      published_at
    }
  } catch (error) {
    console.error(`기사 상세 정보 스크래핑 실패 (${url}):`, error)
    throw error
  }
}

/**
 * 전체 뉴스 수집 프로세스
 */
export async function collectAllNews(): Promise<ScrapingResult> {
  const result: ScrapingResult = {
    success_count: 0,
    failed_count: 0,
    articles: [],
    errors: []
  }

  try {
    // 1. 메타정보 수집
    const newsMetadata = await scrapeNewsMetadata()
    console.log(`메타정보 수집 완료: ${newsMetadata.length}개 뉴스`)

    // 2. 각 뉴스의 상세 정보 수집
    for (const meta of newsMetadata) {
      try {
        const details = await scrapeArticleDetails(meta.url)
        
        result.articles.push({
          ...meta,
          ...details
        })
        
        result.success_count++
        
        // 서버 부하 방지를 위한 딜레이
        await new Promise(resolve => setTimeout(resolve, 1000))
        
      } catch (error) {
        console.error(`기사 처리 실패 (${meta.url}):`, error)
        result.failed_count++
        result.errors.push(`${meta.title}: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
      }
    }

    console.log(`수집 완료: 성공 ${result.success_count}개, 실패 ${result.failed_count}개`)
    return result

  } catch (error) {
    console.error('전체 수집 프로세스 실패:', error)
    result.errors.push(`전체 프로세스 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
    throw error
  }
}

/**
 * URL에서 기사 ID 추출
 */
export function extractArticleId(url: string): string | null {
  const match = url.match(/idxno=(\d+)/)
  return match ? match[1] : null
} 

/**
 * AI Times Most Popular 섹션에서 TOP 10 뉴스 메타정보 추출
 */
export async function scrapeTop10NewsMetadata(): Promise<{ url: string; ranking: number; title: string }[]> {
  try {
    const response = await fetch('https://www.aitimes.com/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const html = await response.text()
    
    // TOP 10 뉴스 구조 분석 (실제 HTML 구조에 맞게 수정):
    // <div class="item">
    //   <div class="number user-bg">1</div>
    //   <a href="https://www.aitimes.com/news/articleView.html?idxno=200333" target="_top">
    //     <H2 class="auto-titles line-x2 onload">[7월3일] 사람들이 '챗GPT 검색'에 가장 많이 물어보는 분야는</H2>
    //   </a>
    // </div>
    
    const top10Pattern = /<div class="item">\s*<div class="number[^"]*">(\d+)<\/div>\s*<a href="(https:\/\/www\.aitimes\.com\/news\/articleView\.html\?idxno=\d+)"[^>]*><H2[^>]*class="auto-titles[^"]*"[^>]*>([^<]+)<\/H2><\/a>/g
    
    const newsItems: { url: string; ranking: number; title: string }[] = []
    let match
    
    while ((match = top10Pattern.exec(html)) !== null && newsItems.length < 10) {
      const [, ranking, url, title] = match
      newsItems.push({
        url: url.trim(),
        ranking: parseInt(ranking),
        title: title.trim()
      })
    }
    
    console.log(`TOP 10 뉴스 수집: ${newsItems.length}개`)
    
    // 순위별로 정렬
    return newsItems.sort((a, b) => a.ranking - b.ranking)
  } catch (error) {
    console.error('TOP 10 뉴스 메타정보 스크래핑 실패:', error)
    throw error
  }
}

/**
 * TOP 10 뉴스 전체 수집 프로세스
 */
export async function collectTop10News(): Promise<ScrapingResult> {
  const result: ScrapingResult = {
    success_count: 0,
    failed_count: 0,
    articles: [],
    errors: []
  }

  try {
    // 1. TOP 10 메타정보 수집
    const newsMetadata = await scrapeTop10NewsMetadata()
    console.log(`TOP 10 메타정보 수집 완료: ${newsMetadata.length}개 뉴스`)

    // 2. 각 뉴스의 상세 정보 수집
    for (const meta of newsMetadata) {
      try {
        const details = await scrapeArticleDetails(meta.url)
        
        result.articles.push({
          ...meta,
          ...details
        })
        
        result.success_count++
        
        // 서버 부하 방지를 위한 딜레이
        await new Promise(resolve => setTimeout(resolve, 1000))
        
      } catch (error) {
        console.error(`TOP 10 기사 처리 실패 (${meta.url}):`, error)
        result.failed_count++
        result.errors.push(`${meta.title}: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
      }
    }

    console.log(`TOP 10 수집 완료: 성공 ${result.success_count}개, 실패 ${result.failed_count}개`)
    return result

  } catch (error) {
    console.error('TOP 10 전체 수집 프로세스 실패:', error)
    result.errors.push(`TOP 10 프로세스 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
    throw error
  }
} 