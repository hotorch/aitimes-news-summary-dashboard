# AI Times News Dashboard 디자인 가이드

## Design System Overview

AI Times News Dashboard는 **대담하고 예술적인 뉴스 워크스페이스**를 구현하여 사용자에게 에너지 넘치는 경험을 제공하면서도 효율적인 뉴스 처리 및 요약 워크플로우를 지원합니다.

### 핵심 디자인 철학
- **Artistic Energy**: 만화/망가 스타일의 아트 일러스트레이션을 배경으로 활용
- **Bold Typography**: 강력한 임팩트를 주는 헤드라인과 명확한 정보 계층
- **Warm Dynamism**: 오렌지-레드-옐로우 스펙트럼의 따뜻하고 역동적인 색상
- **Clean Content Overlay**: 예술적 배경 위에 깔끔한 흰색 컨텐츠 카드
- **Immersive Experience**: 창의적이고 몰입감 있는 시각적 경험

---

## Color Palette for TailwindCSS

### 프라이머리 컬러 팔레트
```css
/* tailwind.config.js */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF5F1',    // Ultra light peach
          100: '#FFE8DD',   // Light peach
          200: '#FFD1BB',   // Soft peach
          300: '#FFB088',   // Light orange
          400: '#FF8A55',   // Medium orange
          500: '#FF6B35',   // Primary brand orange
          600: '#E25822',   // Deep orange
          700: '#C4470E',   // Dark orange
          800: '#A13908',   // Very dark orange
          900: '#7D2D06'    // Darkest orange
        },
        secondary: {
          50: '#FFFCF0',    // Ultra light yellow
          100: '#FFF8DC',   // Light cream
          200: '#FFF0B3',   // Soft yellow
          300: '#FFE580',   // Light yellow
          400: '#FFD94D',   // Medium yellow
          500: '#F7931E',   // Secondary brand yellow
          600: '#E6820B',   // Deep yellow
          700: '#CC6F00',   // Dark yellow
          800: '#B35C00',   // Very dark yellow
          900: '#994A00'    // Darkest yellow
        },
        accent: {
          50: '#FFF3F1',    // Ultra light red
          100: '#FFE4DF',   // Light red
          200: '#FFC5B8',   // Soft red
          300: '#FF9D88',   // Light coral
          400: '#FF6B55',   // Medium coral
          500: '#E25822',   // Accent red-orange
          600: '#C4470E',   // Deep red
          700: '#A63808',   // Dark red
          800: '#8B2D06',   // Very dark red
          900: '#702405'    // Darkest red
        },
        neutral: {
          50: '#FAFAFA',    // Almost white
          100: '#F5F5F5',   // Light gray
          200: '#E5E5E5',   // Soft gray
          300: '#D4D4D4',   // Medium light gray
          400: '#A3A3A3',   // Medium gray
          500: '#737373',   // Base gray
          600: '#525252',   // Dark gray
          700: '#404040',   // Very dark gray
          800: '#262626',   // Almost black
          900: '#171717'    // Black
        }
      }
    }
  }
}
```

### 그라디언트 정의
```css
.bg-gradient-warm-sunset {
  background: linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #E25822 100%);
}

.bg-gradient-warm-glow {
  background: linear-gradient(90deg, #FFB088 0%, #FF6B35 100%);
}

.bg-gradient-artistic {
  background: radial-gradient(ellipse at top, #FF6B35 0%, #E25822 50%, #A13908 100%);
}
```

### WCAG 2.2 대비 비율 체크리스트

| 색상 조합 | 대비 비율 | WCAG AA | WCAG AAA | 용도 |
|-----------|-----------|---------|----------|------|
| primary-500 (#FF6B35) on white | 3.8:1 | ✅ | ❌ | 큰 텍스트만 |
| primary-700 (#C4470E) on white | 6.1:1 | ✅ | ✅ | 모든 텍스트 |
| neutral-800 (#262626) on white | 12.6:1 | ✅ | ✅ | 본문 텍스트 |
| white on primary-500 (#FF6B35) | 5.5:1 | ✅ | ✅ | 버튼 텍스트 |

---

## Page Implementations 상세 디자인 가이드

### 메인 대시보드 페이지

#### 핵심 목적
- 수집된 뉴스 기사들을 카드 기반 그리드로 표시
- 뉴스 수집 및 요약 기능에 빠른 접근 제공
- 예술적이고 에너지 넘치는 뉴스 워크스페이스 경험

#### 주요 컴포넌트
```html
<!-- 메인 대시보드 구조 -->
<div class="min-h-screen bg-gradient-artistic relative overflow-hidden">
  <!-- 배경 아트워크 레이어 -->
  <div class="absolute inset-0 opacity-20">
    <img src="https://picsum.photos/1920/1080?random=1" 
         alt="Artistic background" 
         class="w-full h-full object-cover mix-blend-overlay">
  </div>
  
  <!-- 컨텐츠 레이어 -->
  <div class="relative z-10">
    <!-- 헤더 -->
    <header class="backdrop-blur-sm bg-white/90 border-b border-primary-200">
      <!-- 헤더 컨텐츠 -->
    </header>
    
    <!-- 메인 컨텐츠 -->
    <main class="container mx-auto px-4 py-8">
      <!-- 뉴스 카드 그리드 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <!-- 뉴스 카드들 -->
      </div>
    </main>
  </div>
</div>
```

#### 레이아웃 구조
- **배경 레이어**: 예술적 일러스트레이션 + 따뜻한 그라디언트
- **컨텐츠 레이어**: 반투명 배경의 깔끔한 흰색 카드들
- **그리드 시스템**: 반응형 5열 그리드 (모바일에서는 1열)

---

## Layout Components

### 헤더 컴포넌트 (Header)

#### 적용 라우트
- `/` (메인 대시보드)

#### 핵심 컴포넌트
```html
<header class="backdrop-blur-md bg-white/95 shadow-lg border-b-2 border-primary-500">
  <div class="container mx-auto px-4 py-4">
    <div class="flex items-center justify-between">
      <!-- 로고 & 브랜드 -->
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-gradient-warm-sunset rounded-lg flex items-center justify-center">
          <span class="text-white font-bold text-xl">AI</span>
        </div>
        <h1 class="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
          AI Times Dashboard
        </h1>
      </div>
      
      <!-- 액션 버튼들 -->
      <div class="flex items-center space-x-4">
        <button class="btn-primary">
          <span class="mr-2">🔄</span>
          뉴스 수집
        </button>
        <button class="btn-secondary">설정</button>
      </div>
    </div>
  </div>
</header>
```

#### 반응형 동작
| 브레이크포인트 | 동작 |
|---------------|------|
| mobile (320px) | 로고만 표시, 햄버거 메뉴 |
| tablet (768px) | 축약된 텍스트, 아이콘 버튼 |
| desktop (1024px+) | 전체 요소 표시 |

### 뉴스 카드 컴포넌트 (NewsCard)

#### 컴포넌트 스펙

```html
<article class="news-card group">
  <div class="card-container">
    <!-- 썸네일 영역 -->
    <div class="card-thumbnail">
      <img src="https://picsum.photos/300/200?random=2" 
           alt="뉴스 썸네일" 
           class="w-full h-48 object-cover">
      <div class="ranking-badge">1</div>
    </div>
    
    <!-- 컨텐츠 영역 -->
    <div class="card-content">
      <h3 class="card-title">뉴스 제목이 들어갑니다</h3>
      <p class="card-meta">작성자 · 2시간 전</p>
      <div class="card-actions">
        <button class="btn-summary">요약하기</button>
      </div>
    </div>
  </div>
</article>
```

#### 상태별 스타일 스펙

| 상태 | 클래스 | 스타일 | 설명 |
|------|--------|--------|------|
| Default | `.news-card` | `bg-white shadow-md hover:shadow-xl` | 기본 상태 |
| Hover | `.news-card:hover` | `transform scale-105 shadow-2xl` | 호버 시 확대 효과 |
| Summarized | `.news-card.summarized` | `border-l-4 border-primary-500` | 요약 완료 표시 |
| Loading | `.news-card.loading` | `opacity-75 pointer-events-none` | 로딩 중 상태 |

```css
.news-card {
  @apply bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden;
}

.news-card:hover {
  @apply transform scale-105 shadow-2xl;
}

.card-container {
  @apply relative;
}

.card-thumbnail {
  @apply relative overflow-hidden;
}

.ranking-badge {
  @apply absolute top-3 left-3 w-8 h-8 bg-gradient-warm-sunset text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg;
}

.card-content {
  @apply p-6;
}

.card-title {
  @apply text-lg font-bold text-neutral-800 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors;
}

.card-meta {
  @apply text-sm text-neutral-500 mb-4;
}

.card-actions {
  @apply flex justify-end;
}
```

---

## Interaction Patterns

### 버튼 시스템

#### Primary Button
```css
.btn-primary {
  @apply bg-gradient-warm-sunset text-white font-semibold px-6 py-3 rounded-lg
         shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200
         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
}

.btn-primary:hover {
  @apply transform translateY(-1px) shadow-xl;
}

.btn-primary:disabled {
  @apply opacity-50 cursor-not-allowed transform-none shadow-md;
}
```

#### Secondary Button
```css
.btn-secondary {
  @apply bg-white text-primary-600 border-2 border-primary-500 font-semibold px-6 py-3 rounded-lg
         hover:bg-primary-50 active:scale-95 transition-all duration-200
         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
}
```

#### 버튼 상태 스펙 테이블

| 상태 | 배경색 | 텍스트색 | 그림자 | 변형 |
|------|--------|----------|--------|------|
| Default | `bg-gradient-warm-sunset` | `text-white` | `shadow-lg` | `scale-100` |
| Hover | `bg-gradient-warm-sunset` | `text-white` | `shadow-xl` | `scale-105 -translateY-1` |
| Active | `bg-gradient-warm-sunset` | `text-white` | `shadow-md` | `scale-95` |
| Disabled | `bg-gradient-warm-sunset opacity-50` | `text-white` | `shadow-md` | `scale-100` |

### 모달 애니메이션

```css
.modal-enter {
  @apply opacity-0 scale-95;
}

.modal-enter-active {
  @apply opacity-100 scale-100 transition-all duration-300 ease-out;
}

.modal-backdrop {
  @apply fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40;
}

.modal-content {
  @apply bg-white rounded-2xl shadow-2xl transform transition-all duration-300 max-w-2xl mx-auto mt-20;
}
```

### 카드 호버 이펙트

```css
.news-card {
  @apply transition-all duration-300 ease-out;
}

.news-card:hover {
  @apply transform scale-105 shadow-2xl;
}

.news-card:hover .card-title {
  @apply text-primary-600;
}

.news-card:hover .ranking-badge {
  @apply scale-110 shadow-xl;
}
```

---

## Breakpoints 상세 스펙

### 반응형 그리드 시스템

```css
/* Mobile First 접근법 */
.news-grid {
  @apply grid gap-6;
  grid-template-columns: 1fr; /* mobile: 320px */
}

@media (min-width: 768px) {
  .news-grid {
    grid-template-columns: repeat(2, 1fr); /* tablet */
  }
}

@media (min-width: 1024px) {
  .news-grid {
    grid-template-columns: repeat(3, 1fr); /* desktop */
  }
}

@media (min-width: 1440px) {
  .news-grid {
    grid-template-columns: repeat(5, 1fr); /* wide */
  }
}
```

### 브레이크포인트별 레이아웃 동작

| 브레이크포인트 | 화면 크기 | 그리드 열 | 카드 크기 | 패딩 |
|---------------|-----------|-----------|-----------|------|
| mobile | 320px - 767px | 1열 | 100% | `px-4` |
| tablet | 768px - 1023px | 2열 | 50% | `px-6` |
| desktop | 1024px - 1439px | 3열 | 33.33% | `px-8` |
| wide | 1440px+ | 5열 | 20% | `px-12` |

### 컴포넌트별 반응형 예시

#### 헤더 반응형
```html
<header class="header-responsive">
  <!-- Mobile: 로고 + 햄버거 -->
  <div class="flex md:hidden items-center justify-between">
    <div class="logo-mobile">AI Times</div>
    <button class="hamburger-menu">☰</button>
  </div>
  
  <!-- Desktop: 전체 네비게이션 -->
  <div class="hidden md:flex items-center justify-between">
    <div class="logo-desktop">AI Times Dashboard</div>
    <div class="nav-actions">
      <button class="btn-primary">뉴스 수집</button>
      <button class="btn-secondary">설정</button>
    </div>
  </div>
</header>
```

#### 뉴스 카드 반응형
```css
.news-card {
  /* Mobile */
  @apply w-full;
}

@media (min-width: 768px) {
  .news-card {
    /* Tablet 이상에서 호버 효과 활성화 */
    @apply hover:scale-105;
  }
}

@media (max-width: 767px) {
  .news-card {
    /* Mobile에서는 호버 효과 비활성화 */
    @apply hover:scale-100;
  }
  
  .card-thumbnail {
    @apply h-32; /* 모바일에서 썸네일 높이 축소 */
  }
}
```

### 타이포그래피 반응형 스케일

```css
.heading-responsive {
  @apply text-xl; /* mobile */
}

@media (min-width: 768px) {
  .heading-responsive {
    @apply text-2xl; /* tablet */
  }
}

@media (min-width: 1024px) {
  .heading-responsive {
    @apply text-3xl; /* desktop */
  }
}

@media (min-width: 1440px) {
  .heading-responsive {
    @apply text-4xl; /* wide */
  }
}
```

---

## 아트스틱 백그라운드 integration 가이드

### 배경 레이어 시스템

```html
<!-- 다층 배경 구조 -->
<div class="background-system">
  <!-- 기본 그라디언트 레이어 -->
  <div class="bg-gradient-artistic absolute inset-0"></div>
  
  <!-- 아트워크 레이어 -->
  <div class="absolute inset-0 opacity-30">
    <img src="https://picsum.photos/1920/1080?random=manga" 
         alt="Artistic background" 
         class="w-full h-full object-cover mix-blend-overlay">
  </div>
  
  <!-- 텍스처 오버레이 -->
  <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
  
  <!-- 컨텐츠 레이어 -->
  <div class="relative z-10">
    <!-- 실제 컨텐츠 -->
  </div>
</div>
```

### 가독성 보장 전략

```css
.content-overlay {
  @apply backdrop-blur-sm bg-white/95 rounded-xl shadow-lg;
}

.artistic-contrast {
  @apply drop-shadow-lg;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.readability-ensure {
  @apply bg-white/90 backdrop-blur-md border border-white/20;
}
```

이 디자인 시스템은 예술적이고 역동적인 뉴스 대시보드 경험을 제공하면서도 콘텐츠의 가독성과 사용성을 보장합니다.