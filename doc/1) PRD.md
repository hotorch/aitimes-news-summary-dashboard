# AI Times News Summary Dashboard PRD

## 제품 개요

AI Times News Summary Dashboard는 aitimes.com에서 AI 뉴스를 자동으로 수집, 저장, 요약하는 개인용 도구입니다. 이 대시보드를 통해 솔로프레너는 AI 뉴스를 효율적으로 처리하고 다양한 채널(카카오톡 오픈채팅, 소셜미디어 플랫폼)을 통해 큐레이션된 요약을 청중과 공유할 수 있습니다. 시스템은 수동 뉴스 수집의 번거로운 과정을 자동화하고 Make.com integration을 통한 빠른 요약 기능을 제공합니다.

## 목표 및 성공 지표 (Goals & KPIs)

### 핵심 목표
- 뉴스 수집 시간을 수동 프로세스에서 자동화된 1클릭 작업으로 단축
- 일일 상위 10개 AI 뉴스의 빠른 요약 및 공유 가능
- 일관된 뉴스 모니터링 및 청중 참여 유지
- 뉴스 발견에서 청중 배포까지의 workflow 간소화

### 성공 지표
- 자동화된 뉴스 수집 시스템 90% 이상 uptime 달성
- 뉴스 처리 시간 80% 이상 단축
- 일일 뉴스 요약 배포 100% 달성률

## 사용자 페르소나

### 기본 사용자: 솔로프레너 AI & Automation Engineer (샘호트만)
- **기술적 배경**: Python, AI/ML, 자동화 도구에 대한 고급 지식
- **사용 사례**: 콘텐츠 제작 및 청중 참여를 위한 개인 생산성 도구
- **workflow**: 일일 뉴스 모니터링 → 빠른 요약 → 다채널 배포
- **선호사항**: ROI 기반 자동화, 구조화된 문서화, 효율적인 workflow

## 문제점 및 해결방안

### 현재 문제점
- aitimes.com에서 수동 뉴스 수집이 시간 소모적이고 비효율적
- 청중 공유를 위한 다수 뉴스 기사의 빠른 처리 및 요약 어려움
- 일관된 뉴스 모니터링 및 신속한 콘텐츠 배포 필요성
- AI 뉴스 workflow 관리를 위한 중앙화된 대시보드 부재
- 청중에게 적시에 AI 뉴스 요약을 전달해야 하는 시간적 압박

### 해결방안
- 웹 스크래핑 기반 자동 뉴스 수집 시스템 구축
- Make.com webhook integration을 통한 AI 기반 자동 요약
- Supabase 기반 중앙화된 메타데이터 관리
- 카드 기반 직관적 대시보드 인터페이스 제공

## 핵심 기능 (Must-Have Features)

### 1. 뉴스 수집 시스템
- **최신 뉴스 수집**: aitimes.com 최신 뉴스를 자동 수집하는 1클릭 버튼
- **TOP 10 뉴스 수집**: aitimes.com 인기 TOP 10 뉴스를 수집하는 전용 버튼
- 자동 추출 데이터: 뉴스 제목, URL, 순위, 게시 시간, 작성자, 대표 이미지, 전체 기사 내용
- 중복 URL 방지 시스템 (upsert 기능)

### 2. Supabase Database 저장
- 수집된 모든 메타데이터의 구조화된 저장
- 실시간 데이터 동기화 및 관리

### 3. 카드 기반 대시보드
- 썸네일 이미지가 포함된 카드 형태의 뉴스 표시
- 개별 뉴스 카드 클릭 시 요약 옵션 표시

### 4. Make.com Webhook Integration
- "요약" 버튼을 통한 Make.com webhook 연동
- 양방향 통신: POST (요약 요청) + PUT (요약 결과 수신)
- 전체 기사 내용을 포함한 webhook payload 전송
- 요약 완료 시 자동 데이터베이스 업데이트
- 실시간 요약 상태 표시 (요약 중, 요약 완료)

### 5. 실시간 검색 시스템
- 헤더 검색바를 통한 실시간 뉴스 검색
- 디바운싱된 검색 (300ms 지연)
- URL 쿼리 파라미터 연동으로 북마크 가능한 검색 상태

### 6. 고급 UI/UX 시스템
- 스켈레톤 로딩 애니메이션
- 카드 기반 그리드 레이아웃 (모바일 반응형)
- 상태 배지 시스템 (요약 완료, 본문 있음)
- 빈 상태 처리 (데이터 없음, 검색 결과 없음)
- 실시간 토스트 알림 시스템

### 7. 인증 없는 개인용 시스템
- 사용자 인증 불필요 (개인용도만)
- 빠른 접근 및 사용 가능

## 부가 기능 (Nice-to-Have Features)

### 향후 고려사항
- 뉴스 카테고리화 및 태깅 시스템
- 고급 필터링 옵션 (날짜, 작성자 등)
- 소셜미디어 공유를 위한 export 기능
- 예약된 자동 뉴스 수집
- 뉴스 트렌드 분석 및 인사이트
- 다크 모드 지원

## 사용자 시나리오

### 시나리오 1: 일일 뉴스 수집 및 요약
1. 사용자가 대시보드에 접속
2. "뉴스 수집" 또는 "TOP 10" 버튼 클릭하여 원하는 타입 선택
3. 시스템이 aitimes.com에서 뉴스 자동 수집 (로딩 애니메이션 표시)
4. 카드 형태로 뉴스 목록 표시 (썸네일, 순위, 메타정보 포함)
5. 관심 있는 뉴스 카드 클릭하여 상세 모달 오픈
6. "요약하기" 버튼 클릭하여 Make.com webhook 호출 (요약 중 상태 표시)
7. AI 요약 결과가 자동으로 데이터베이스에 저장되고 UI 업데이트
8. 완성된 요약을 청중에게 배포

### 시나리오 2: 실시간 뉴스 검색 및 필터링
1. 헤더 검색바에서 특정 키워드 입력 (예: "ChatGPT")
2. 실시간으로 관련 뉴스만 필터링되어 표시
3. 검색 결과가 없을 경우 적절한 빈 상태 화면 표시
4. URL 공유로 다른 사람과 검색 결과 공유 가능

### 시나리오 3: 과거 뉴스 검토 및 재사용
1. 대시보드에서 이전에 수집된 뉴스 검토 (상태 배지로 요약 여부 확인)
2. 아직 요약하지 않은 뉴스 선택하여 요약 실행
3. 완료된 요약을 다른 채널로 배포

## 기술 요구사항

### Frontend 기술 스택
- **Framework**: Next.js 15 with React (App Router 사용)
- **UI/UX**: 카드 기반 레이아웃, 반응형 디자인, Tailwind CSS
- **상태 관리**: @tanstack/react-query + useState/useEffect
- **HTTP Client**: Fetch API with Next.js API Routes
- **컴포넌트**: shadcn/ui 기반 커스텀 컴포넌트
- **타입 시스템**: TypeScript with Supabase generated types

### Backend 기술 스택
- **API Framework**: Next.js API Routes (서버리스)
- **웹 스크래핑**: Node.js 기반 HTML 파싱 (정규식 활용)
- **HTTP 처리**: Fetch API with error handling
- **Webhook 처리**: Make.com 양방향 integration (POST/PUT endpoints)

### Database 및 저장소
- **Primary Database**: Supabase
- **Data Structure**: 뉴스 메타데이터, 수집 로그, 요약 기록
- **실시간 동기화**: Supabase realtime 기능 활용

### 배포 및 호스팅
- **Frontend**: Vercel 또는 Netlify
- **Backend**: Railway 또는 Heroku
- **환경 변수**: API 키 및 민감 데이터 관리

## 제약사항

### 기술적 제약사항
- 단일 사용자 시스템 (다중 사용자 인증 불필요)
- 기존 Make.com 자동화 workflow와의 필수 연동
- aitimes.com을 주요 뉴스 소스로 제한
- Supabase를 필수 database 솔루션으로 사용

### 운영적 제약사항
- 사이트 구조 변경에 적응하는 안정적인 웹 스크래핑 필요
- Make.com webhook integration 요구사항 준수
- 서버 리소스 존중을 위한 적절한 rate limiting

## 보안 및 컴플라이언스

### 기본 보안 조치
- **Rate Limiting**: aitimes.com 서버 리소스 존중을 위한 웹 스크래핑 제한
- **Webhook 보안**: Make.com integration을 위한 secure endpoint 구성
- **Database 보안**: Supabase Row Level Security (RLS) 구성
- **환경 관리**: API 키 및 민감 데이터를 위한 환경 변수 관리
- **CORS 구성**: Frontend-Backend 통신을 위한 적절한 CORS 설정

### 데이터 보호
- 개인용 시스템으로 외부 사용자 데이터 처리 없음
- 수집된 뉴스 데이터의 적절한 저장 및 관리
- webhook payload의 secure 전송

## 개발 우선순위 및 마일스톤

### Phase 1: 핵심 기능 구현 (4-6주)
- 웹 스크래핑 시스템 구축
- Supabase database 설정 및 연동
- 기본 대시보드 UI 개발
- Make.com webhook integration

### Phase 2: 사용자 경험 개선 (2-3주)
- 카드 기반 UI 최적화
- 에러 처리 및 로딩 상태 개선
- 반응형 디자인 구현

### Phase 3: 안정성 및 최적화 (2주)
- Rate limiting 구현
- 보안 강화
- 성능 최적화
- 배포 및 모니터링 설정

### Phase 4: 부가 기능 (향후 계획)
- 검색 및 필터 기능
- 예약 자동 수집
- 고급 분석 기능