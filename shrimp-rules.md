# Development Guidelines — readboard

## Project Overview

- **목적**: 노션 데이터베이스의 독서 기록을 공개 웹 페이지로 자동 노출하는 1인 독서 기록 공유 서비스
- **스택**: Next.js 16 (App Router) + React 19 + TypeScript 5.9 (strict) + Tailwind CSS 4 + CVA
- **패키지 매니저**: pnpm 10, Node.js 22+
- **데이터 소스**: Notion API (`@notionhq/client`) — Server Component 전용
- **단일 페이지 MVP**: 루트 경로(`/`)에서 독서 목록 카드 그리드 + 상태별 탭 필터링

## Project Architecture

```
src/
├── app/                    # 라우팅 thin layer (데이터 패칭 + 레이아웃만)
│   ├── layout.tsx          # 루트 레이아웃 (Header, Footer)
│   ├── page.tsx            # 홈 — Server Component, fetchReadingList() 호출
│   ├── loading.tsx         # 스켈레톤 UI (Next.js 자동 처리)
│   └── error.tsx           # 에러 바운더리 ("use client")
│
├── features/               # 도메인별 모듈
│   └── reading/            # 독서 기록 핵심 모듈
│       ├── components/     # UI 컴포넌트
│       ├── services/       # Notion API 클라이언트 (Server 전용)
│       ├── types/          # 도메인 타입 (ReadingItem, ReadingStatus 등)
│       └── index.ts        # 배럴: 컴포넌트만 re-export
│
└── shared/                 # 공통 모듈
    ├── layouts/            # Header, Footer, Container
    ├── ui/                 # 재사용 UI (shadcn/ui 기반, 현재 비어있음)
    ├── hooks/              # useTheme 등
    ├── utils/              # cn() 등
    ├── styles/             # 전역 CSS (globals, tokens, base, animations)
    └── fonts/              # next/font/local 폰트 파일
```

### Module Boundaries

| 모듈                | import 가능 대상             | import 금지 대상             |
| ------------------- | ---------------------------- | ---------------------------- |
| `app/`              | `features/*`, `shared/*`     | 다른 `app/` 파일의 내부 로직 |
| `features/reading/` | `shared/*`, 자신의 하위 모듈 | 다른 `features/*`, `app/`    |
| `shared/`           | `shared/*` 내 다른 모듈      | `features/*`, `app/`         |

## Code Standards

### Naming

- **파일명**: PascalCase (컴포넌트), camelCase (유틸/서비스/훅)
- **컴포넌트**: PascalCase (`ReadingCard.tsx`)
- **타입**: PascalCase (`ReadingItem`, `StatusFilter`)
- **변수/함수**: camelCase (`fetchReadingList`, `mapPageToReadingItem`)
- **상수**: UPPER_SNAKE_CASE (`STATUS_MAP`)
- **CSS 클래스**: Tailwind 유틸리티만 사용, 커스텀 클래스 금지

### Language Rules

- **코드 식별자**: 영어 (`fetchReadingList`, `ReadingCard`)
- **UI 텍스트/주석/커밋**: 한국어
- **Notion DB 속성명**: 한글 그대로 사용 (`제목`, `저자`, `상태`)

### Import Rules

- **경로 별칭**: `@/*` → `./src/*` (절대 경로 필수)
- **import 순서**: `eslint-plugin-simple-import-sort` 자동 정렬
- **type import**: `import type { X }` 사용 (`verbatimModuleSyntax: true`)

```typescript
// O 올바른 예
import type { ReadingItem } from "@/features/reading/types";
import { ReadingCard } from "@/features/reading";
import { cn } from "@/shared/utils";

// X 잘못된 예
import { ReadingItem } from "@/features/reading/types"; // type 누락
import { cn } from "../../shared/utils"; // 상대 경로 금지
```

## Component Implementation Standards

### Props Declaration

```typescript
// O 반드시 별도 type으로 선언
type ReadingCardProps = {
  item: ReadingItem;
  className?: string;
};

export function ReadingCard({ item, className }: ReadingCardProps) { ... }

// X 인라인 타입 금지
export function ReadingCard({ item }: { item: ReadingItem }) { ... }
```

### Export Rules

- 파일당 하나의 컴포넌트만 export
- Props 타입은 외부에 노출하지 않음 — 외부에서 필요 시 `ComponentProps<typeof ReadingCard>` 사용
- 배럴 파일(`index.ts`)은 **컴포넌트만** re-export (타입 re-export 금지)
- 서비스 파일(`services/`)은 배럴에 포함하지 않음 — 직접 경로로 import

```typescript
// features/reading/components/index.ts — O 올바른 예
export { ReadingCard } from "./ReadingCard";
export { StatusTabs } from "./StatusTabs";

// features/reading/index.ts — O 올바른 예
export { ReadingCard, StatusTabs } from "./components";

// X 금지: 타입을 배럴에서 re-export
export type { ReadingItem } from "./types";

// X 금지: 서비스를 배럴에서 re-export
export { fetchReadingList } from "./services/notionClient";
```

### "use client" Directive

- hooks, browser API, event handler를 **직접** 사용하는 파일에만 선언
- 순수 표현 컴포넌트는 선언하지 않음 (Client Component 하위에서 자동 Client 동작)
- `useSearchParams()` 사용 시 반드시 `<Suspense>` 경계로 감싸기

### Compound Components

- `Object.assign` 패턴 사용
- 서브 컴포넌트에 부모 prefix 필수: `CardHeader`, `CardTitle`, `CardContent`

## Styling Standards

### Tailwind CSS

- **임의값 금지**: `min-w-[8rem]` X → `min-w-32` O
- **cn() 유틸리티 필수 사용**: 조건부 클래스 조합 시
- **반응형 브레이크포인트**: `sm:640px`, `lg:1024px`, `xl:1280px`
- **컨테이너**: `Container` 컴포넌트 사용 (`max-w-5xl px-4 sm:px-6`)

```typescript
// O 올바른 예
<div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3", className)}>

// X 잘못된 예
<div className={`grid grid-cols-1 sm:grid-cols-2 ${className}`}>  // cn() 미사용
<div className="min-w-[200px]">                                    // 임의값 사용
```

### Dark Mode

- 클래스 기반 (`.dark`), `ThemeScript`로 FOUC 방지
- CSS 변수 기반 색상: `text-foreground`, `bg-background`, `border-border`
- 하드코딩 색상 금지: `text-gray-900` X → `text-foreground` O

## Notion API Integration Standards

### Security Rules

- **`notionClient.ts`는 Server 전용** — `"use client"` 선언 금지
- **환경 변수 (`NOTION_API_KEY`, `NOTION_DATABASE_ID`)는 브라우저에 노출 금지**
- `NEXT_PUBLIC_` prefix 절대 사용하지 않음

### Data Flow

```
[Server Component: page.tsx]
    → fetchReadingList() (Server only)
        → notion.databases.query()
        → mapPageToReadingItem() (변환)
    → <ReadingBoard items={data.items} /> (Client Component에 props 전달)
```

- 서버에서 데이터 패칭 → 클라이언트 컴포넌트에 props로 전달
- 클라이언트에서 Notion API 직접 호출 금지
- 필터링은 클라이언트 사이드에서 수행 (서버 재호출 없음)

### Notion Property Mapping

| Notion 속성명 | 타입         | ReadingItem 필드 | 폴백                   |
| ------------- | ------------ | ---------------- | ---------------------- |
| `제목`        | title        | `title`          | 빈 문자열 금지, 필수   |
| `저자`        | rich_text    | `author`         | `null`                 |
| `상태`        | select       | `status`         | 필수 (`ReadingStatus`) |
| `평점`        | number       | `rating`         | `null` (미표시)        |
| `표지 이미지` | url          | `coverImageUrl`  | `null` (플레이스홀더)  |
| `카테고리`    | multi_select | `categories`     | `[]`                   |
| `등록일`      | date         | `registeredAt`   | `null`                 |

### Caching

- `"use cache"` 디렉티브 + `cacheLife("hours")` (1시간)
- MVP에서 수동 revalidate 미지원

## Key File Interaction Standards

### Component Creation Checklist

새 컴포넌트 생성 시 반드시 아래 파일을 함께 수정:

1. `src/features/reading/components/NewComponent.tsx` — 컴포넌트 생성
2. `src/features/reading/components/index.ts` — 배럴에 re-export 추가
3. `src/features/reading/index.ts` — 루트 배럴에 re-export 추가

### Page Modification Checklist

`page.tsx` 변경 시 확인:

1. `loading.tsx` — 스켈레톤이 실제 레이아웃과 일치하는지
2. `error.tsx` — 에러 UI가 해당 페이지 컨텍스트에 적합한지

### Type Modification Checklist

`types/index.ts` 변경 시 확인:

1. `services/notionMapper.ts` — 매핑 로직이 새 타입과 일치하는지
2. 해당 타입을 사용하는 모든 컴포넌트 — props 호환성

### Shared Component Modification

`shared/` 하위 컴포넌트 수정 시:

1. 해당 컴포넌트를 사용하는 모든 feature 확인 (`@/shared/...` 검색)
2. 기존 API 호환성 유지 또는 모든 호출부 일괄 수정

## Workflow Standards

### Verification Commands

```bash
pnpm type:check    # TypeScript strict 검사
pnpm lint          # ESLint
pnpm build         # 프로덕션 빌드
pnpm dev           # 개발 서버 (port 3100)
```

- 모든 변경 후 `pnpm type:check` + `pnpm lint` 통과 필수
- pre-commit hooks (lefthook): prettier + type-check + eslint 자동 실행

### Commit Convention

- 형식: `<타입>: <한국어 제목>` (50자 이내)
- 타입: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`
- 원자적 커밋: 하나의 논리적 변경만 포함
- `.env`, 시크릿 파일 커밋 금지

### Reference Documents

작업 전 반드시 참조:

| 문서        | 경로                  | 용도                                 |
| ----------- | --------------------- | ------------------------------------ |
| PRD         | `docs/PRD.md`         | 기능 명세, 데이터 모델, 수용 기준    |
| ROADMAP     | `docs/ROADMAP.md`     | 개발 순서, Phase별 Task, 테스트 전략 |
| CONVENTIONS | `docs/CONVENTIONS.md` | 컴포넌트/CSS/테마 상세 컨벤션        |

## AI Decision-making Standards

### New Feature Implementation

```
1. docs/PRD.md에서 해당 기능 명세 확인
2. docs/ROADMAP.md에서 해당 Task 위치/선행 조건 확인
3. 기존 코드 패턴 확인 (동일 디렉토리의 기존 파일 참조)
4. 구현 → pnpm type:check → pnpm lint → 테스트
```

### Ambiguous Situations

| 상황                                 | 결정                                                                     |
| ------------------------------------ | ------------------------------------------------------------------------ |
| 컴포넌트를 Server vs Client로 만들지 | hooks/이벤트 핸들러 없으면 Server                                        |
| 새 유틸리티 위치                     | `shared/utils/` (공통) 또는 `features/reading/` (도메인 전용)            |
| 새 UI 컴포넌트 위치                  | 재사용 가능 → `shared/ui/`, 도메인 전용 → `features/reading/components/` |
| 타입을 어디에 정의할지               | 도메인 타입 → `features/reading/types/`, 공통 → `shared/` 내 해당 모듈   |
| 이미지 태그 선택                     | 외부 URL → `<img>`, 내부 이미지 → `next/image`                           |
| 캐싱 전략                            | `"use cache"` + `cacheLife("hours")` (Next.js 16 방식)                   |

### Priority Order

1. PRD 명세 > 기존 코드 패턴 > 일반적 관례
2. TypeScript 타입 안전성 > 코드 간결함
3. Server Component > Client Component (기본값)
4. Tailwind 기본 클래스 > 임의값 > 커스텀 CSS

## Prohibited Actions

- **`NEXT_PUBLIC_NOTION_*` 환경 변수 생성 금지** — Notion 키가 브라우저에 노출됨
- **`"use client"` 파일에서 `@notionhq/client` import 금지**
- **배럴 파일에서 타입 re-export 금지** (도메인 타입 예외)
- **배럴 파일에서 서비스 re-export 금지** — 직접 경로 import 사용
- **Props 인라인 타입 선언 금지** — 별도 type 정의 필수
- **Tailwind 임의값 사용 금지** — 기본 클래스 존재 시
- **하드코딩 색상 금지** — CSS 변수 기반 테마 색상 사용
- **`next/image`로 외부 URL 이미지 금지** (MVP) — `<img>` 태그 사용
- **상대 경로 import 금지** — `@/*` 별칭 사용 필수
- **PRD에 없는 기능 임의 추가 금지**
- **페이지네이션 구현 금지** (MVP 범위 외)
- **`.env`, `.env.local` 파일 커밋 금지**
- **`git add .` 사용 금지** — 파일별 개별 스테이징
