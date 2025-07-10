# AI Times News Dashboard Use-Case 문서 (간소화)

## 핵심 Actor

1. **사용자**: 개인용 뉴스 수집 및 요약 도구 사용
2. **aitimes.com**: 뉴스 소스 제공
3. **Supabase**: 데이터 저장
4. **Make.com**: AI 요약 처리

### System Actor
**웹 스크래핑 서비스**
- **역할**: aitimes.com에서 뉴스 데이터 자동 수집
- **기능**: HTML 파싱, 메타데이터 추출, 컨텐츠 정제
- **제약사항**: Rate limiting 준수, 사이트 구조 변경 대응
- **성능 요구사항**: 10개 기사 수집 시 60초 이내 완료

### External Actor
**Make.com Webhook**
- **역할**: 기사 컨텐츠 AI 요약 처리
- **입력**: 전체 기사 텍스트 + 메타데이터
- **출력**: 구조화된 요약 결과
- **제약사항**: Payload 크기 제한, 응답 시간 30초 이내

### Data Actor
**Supabase Database**
- **역할**: 뉴스 메타데이터 및 컨텐츠 영구 저장
- **기능**: 실시간 읽기/쓰기, Row Level Security 적용
- **성능**: 동시 접속 처리, 자동 백업 및 복구 시스템

### External Actor
**AI Times Website**
- **역할**: 뉴스 컨텐츠 및 구조 제공
- **URL 패턴**: `https://www.aitimes.com/news/articleView.html?idxno={ID}`
- **구조**: HTML DOM 기반 뉴스 리스트 및 상세 페이지
- **제약사항**: 로봇 접근 정책, 서버 부하 관리

### 뉴스 수집 흐름 (개선됨)
1. 뉴스 수집 또는 TOP 10 버튼 클릭 → 로딩 표시 ("수집 중...")
2. aitimes.com 스크래핑 (제목, URL, 썸네일, 본문, 메타데이터)
3. Supabase 저장 (중복 URL 방지 upsert)
4. React Query 무효화로 자동 UI 업데이트
5. 성공/실패 토스트 알림

### 요약 흐름 (개선됨)
1. 카드 클릭 → 모달 열기 (예정) 또는 직접 요약 버튼 클릭
2. Make.com POST webhook 호출 (articleId 전송)
3. Make.com에서 AI 요약 처리 후 PUT callback
4. 자동 데이터베이스 업데이트 및 UI 반영
5. 요약 완료 배지 표시

### 검색 흐름 (신규)
1. 헤더 검색바에 키워드 입력
2. 300ms 디바운싱 후 URL 파라미터 업데이트
3. React Query로 검색 결과 실시간 필터링
4. 북마크 가능한 검색 상태 유지

## 에러 처리 (개선됨)

### 주요 예외 상황
- **네트워크 오류**: 토스트 알림 + 자동 재시도 옵션
- **스크래핑 실패**: 부분 성공 토스트 (예: "10개 중 8개 수집 완료")
- **Make.com 응답 없음**: 타임아웃 처리 + 에러 토스트
- **중복 URL**: upsert로 자동 처리, 사용자에게 별도 알림 없음
- **검색 에러**: 빈 상태 화면 + 재검색 가이드

### 에러 상태 관리
- **React Query**: 자동 에러 바운더리 + 재시도 로직
- **Toast 시스템**: shadcn/ui 기반 일관된 에러 메시지
- **로그 추적**: collection_logs 테이블로 에러 상세 기록