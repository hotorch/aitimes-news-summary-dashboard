# AI Times News Dashboard

AI Times 뉴스 자동 수집 및 요약 대시보드 - 솔로프레너를 위한 개인 생산성 도구

## 📝 프로젝트 개요

AI Times News Dashboard는 [aitimes.com](https://aitimes.com)에서 AI 뉴스를 자동으로 수집, 저장, 요약하는 개인용 도구입니다. 이 대시보드를 통해 솔로프레너는 AI 뉴스를 효율적으로 처리하고 다양한 채널을 통해 큐레이션된 요약을 청중과 공유할 수 있습니다.

### 🎯 핵심 기능

- **🔄 자동 뉴스 수집**: AI Times에서 최신 뉴스 및 TOP 10 뉴스 원클릭 수집
- **📊 카드 기반 대시보드**: 직관적인 뉴스 카드 그리드 인터페이스
- **🤖 AI 요약**: Make.com webhook을 통한 자동 뉴스 요약
- **🔍 실시간 검색**: 수집된 뉴스의 실시간 검색 및 필터링
- **💾 자동 저장**: Supabase를 통한 중앙화된 데이터 관리

## 🚀 시작하기

### 필수 조건

- Node.js 18.0 이상
- npm 또는 yarn
- Supabase 계정 및 프로젝트
- Make.com 계정 (요약 기능용)

### 설치 및 실행

1. **저장소 클론**
   ```bash
   git clone https://github.com/hotorch/aitimes-news-summary-dashboard.git
   cd aitimes-news-summary-dashboard
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **환경 변수 설정**
   ```bash
   cp .env.example .env.local
   ```
   
   `.env.local` 파일에 다음 변수들을 설정하세요:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   MAKE_WEBHOOK_URL=your_make_webhook_url
   ```

4. **개발 서버 실행**
   ```bash
   npm run dev
   ```

5. **브라우저에서 확인**
   
   [http://localhost:3000](http://localhost:3000)을 열어 대시보드를 확인하세요.

## 🛠 기술 스택

### Frontend
- **Next.js 15** - React 프레임워크 (App Router)
- **TypeScript** - 타입 안전성
- **Tailwind CSS** - 유틸리티 기반 스타일링
- **Shadcn/ui** - 접근성 높은 UI 컴포넌트
- **Lucide React** - 아이콘 시스템

### 상태 관리 & 데이터
- **TanStack Query** - 서버 상태 관리
- **Supabase** - 백엔드 서비스 (데이터베이스, API)
- **React Hook Form** - 폼 상태 관리
- **Zod** - 스키마 검증

### 개발 도구
- **ESLint** - 코드 품질 관리
- **TypeScript** - 정적 타입 검사
- **PostCSS** - CSS 후처리

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API 라우트
│   │   ├── collect-news/  # 최신 뉴스 수집
│   │   ├── collect-top10-news/ # TOP 10 뉴스 수집
│   │   └── summarize/     # 요약 API
│   ├── globals.css        # 글로벌 스타일
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx          # 메인 페이지
│   └── providers.tsx     # React Query 프로바이더
├── components/            # React 컴포넌트
│   ├── layout/           # 레이아웃 컴포넌트
│   ├── news/             # 뉴스 관련 컴포넌트
│   └── ui/               # 재사용 가능한 UI 컴포넌트
├── hooks/                # 커스텀 훅
├── lib/                  # 유틸리티 함수
│   ├── database.types.ts # Supabase 타입 정의
│   ├── scraping.ts      # 웹 스크래핑 로직
│   ├── supabase.ts      # Supabase 클라이언트
│   └── utils.ts         # 공통 유틸리티
```

## 🔧 주요 기능 설명

### 뉴스 수집
- **최신 뉴스 수집**: AI Times 최신 뉴스를 자동 스크래핑
- **TOP 10 수집**: 인기 TOP 10 뉴스 수집
- **중복 방지**: URL 기반 중복 뉴스 자동 필터링
- **메타데이터 추출**: 제목, 작성자, 썸네일, 본문 등 자동 추출

### 데이터 관리
- **Supabase 저장**: 수집된 모든 뉴스 메타데이터 저장
- **실시간 동기화**: React Query를 통한 실시간 데이터 업데이트
- **수집 로그**: 수집 과정의 성공/실패 로그 관리

### 사용자 인터페이스
- **카드 기반 그리드**: 뉴스를 카드 형태로 직관적 표시
- **반응형 디자인**: 모바일부터 데스크톱까지 최적화
- **실시간 검색**: 제목 및 요약 내용 기반 즉시 검색
- **상태 표시**: 요약 완료, 수집 중 등 상태 배지

### AI 요약 시스템
- **Make.com 연동**: webhook을 통한 외부 AI 요약 서비스 연동
- **양방향 통신**: 요약 요청 전송 및 결과 수신
- **자동 업데이트**: 요약 완료 시 자동 UI 업데이트

## 🚀 배포

### Vercel 배포 (권장)

1. **Vercel에 프로젝트 연결**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **환경 변수 설정**
   
   Vercel 대시보드에서 환경 변수를 설정하세요.

### 기타 플랫폼
- **Netlify**: `npm run build` 후 `out` 폴더 배포
- **Railway**: 자동 배포 설정 가능

## 🔒 환경 변수

| 변수명 | 설명 | 필수 여부 |
|--------|------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 익명 키 | ✅ |
| `MAKE_WEBHOOK_URL` | Make.com webhook URL | ✅ |

## 📊 데이터베이스 스키마

### news_articles 테이블
```sql
CREATE TABLE news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url VARCHAR(1000) UNIQUE NOT NULL,
  ranking INTEGER CHECK (ranking BETWEEN 1 AND 10),
  title VARCHAR(500) NOT NULL,
  content TEXT,
  thumbnail_url VARCHAR(1000),
  author VARCHAR(200),
  published_at TIMESTAMP,
  summary TEXT,
  summary_created_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### collection_logs 테이블
```sql
CREATE TABLE collection_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  total_articles INTEGER,
  success_count INTEGER,
  failed_count INTEGER,
  error_details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 지원

문제가 발생하거나 질문이 있으시면 [Issues](https://github.com/hotorch/aitimes-news-summary-dashboard/issues)를 통해 문의해 주세요.

---

**AI Times News Dashboard** - 효율적인 AI 뉴스 관리를 위한 개인 생산성 도구
