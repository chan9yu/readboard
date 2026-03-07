# PRD: readboard — 독서 기록 보드 서비스

작성일: 2026-03-05
버전: 1.0 (MVP)

---

## 1. 프로젝트 핵심

- **목적**: 노션 데이터베이스에 기록한 책/아티클을 별도 설정 없이 공개 웹 페이지로 자동 노출하여, 독서 기록을 보기 좋게 공유한다
- **타겟 사용자**: 독서 기록을 노션으로 관리하며 공개 포트폴리오로 공유하고 싶은 1인 개발자/독서가

---

## 2. 사용자 여정

```
[외부 공유 링크 접속]
        │
        ▼
[독서 목록 페이지] ──── 초기 로드 중 ────► [스켈레톤 UI 표시]
        │                                          │
        │ 데이터 로드 완료                         │ 로드 완료
        ▼◄─────────────────────────────────────────┘
[상태별 탭 그리드 표시]
  ├── 탭: 전체 / 읽는중 / 완독 / 읽을예정
  │
  ├── [탭 선택] ──► [해당 상태 카드만 필터링 표시]
  │
  └── [Notion API 오류] ──► [에러 배너 표시]
```

**Happy Path**: 접속 → 스켈레톤 → 전체 목록(기본: 전체 탭) → 탭 클릭 → 필터링된 카드 표시

**예외 케이스**:

- Notion API 호출 실패 → 에러 메시지 배너 표시, 빈 목록 대신 Alert 컴포넌트 사용
- 해당 상태 항목 없음 → "아직 등록된 항목이 없습니다" 빈 상태 메시지 표시
- 표지 이미지 없음 → 기본 플레이스홀더 이미지 표시
- 평점 없음 → 평점 영역 미표시

---

## 3. 기능 명세 (MVP 중심)

### F001 — 독서 목록 조회

- **구현 페이지**: 독서 목록 페이지
- **동작 설명**: 페이지 진입 시 Notion API를 통해 전체 독서/아티클 목록을 가져와 카드 그리드로 렌더링한다
- **입력**: Notion Database ID, Notion API Key (환경 변수)
- **출력**: 책/아티클 카드 목록 (제목, 저자, 상태, 평점, 카테고리, 표지 이미지) + 상태별 통계 요약 (N권 완독 / N권 읽는중)
- **비즈니스 규칙**:
  - Server Component에서 직접 Notion API 호출 (클라이언트 노출 금지)
  - 등록일(Date) 기준 내림차순 정렬 (최신순)
  - 최대 100개 항목 조회 (Notion API 기본 page_size 제한)
  - Next.js `revalidate` 캐시 적용 (기본 3600초 = 1시간)
- **엣지 케이스**:
  - API 키 미설정 → 빌드 타임 오류로 조기 감지
  - API 호출 실패 → `error.tsx`에서 에러 UI 표시
  - 데이터베이스 비어있음 → 빈 상태 메시지 표시
  - 100개 초과 데이터 → MVP에서 페이지네이션 미지원, 최신 100개만 표시

### F002 — 상태별 필터링

- **구현 페이지**: 독서 목록 페이지
- **동작 설명**: 탭(전체/읽는중/완독/읽을예정)을 선택하면 해당 상태의 항목만 카드 그리드에 표시된다
- **입력**: 사용자 탭 클릭 이벤트 (상태값: `all` | `reading` | `done` | `planned`)
- **출력**: 필터링된 카드 목록
- **비즈니스 규칙**:
  - 필터링은 클라이언트 사이드에서 수행 (서버 재호출 없음)
  - 기본 선택 탭: "전체"
  - URL 쿼리 파라미터(`?status=reading`)로 상태 유지 — 공유/새로고침 시 필터 유지
  - `useSearchParams()`를 사용하는 컴포넌트는 반드시 `<Suspense>` 경계로 감싸야 함 (정적 생성 보장)
- **엣지 케이스**:
  - 선택한 상태에 해당 항목 없음 → "이 상태의 항목이 없습니다" 메시지 표시
  - 유효하지 않은 쿼리 파라미터 → "전체" 탭으로 폴백

### F003 — 로딩 스켈레톤

- **구현 페이지**: 독서 목록 페이지
- **동작 설명**: 서버에서 데이터를 패칭하는 동안 카드 형태의 스켈레톤 UI를 표시하여 레이아웃 시프트를 방지한다
- **입력**: 없음 (Next.js `loading.tsx` 자동 처리)
- **출력**: 카드 형태의 `Skeleton` 컴포넌트 12개 그리드
- **비즈니스 규칙**:
  - 기존 `Skeleton` 컴포넌트(`src/shared/ui/Skeleton.tsx`) 재사용
  - 실제 카드와 동일한 크기/레이아웃 유지
- **엣지 케이스**: 없음

### F004 — 반응형 카드 그리드

- **구현 페이지**: 독서 목록 페이지
- **동작 설명**: 화면 너비에 따라 카드 열 수가 자동 조정된다
- **입력**: 없음 (CSS 반응형)
- **출력**: 모바일 1열 → 태블릿 2열 → 데스크톱 3~4열 그리드
- **비즈니스 규칙**:
  - Tailwind CSS 반응형 클래스 사용 (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`)
  - 카드 최소 너비 유지로 레이아웃 깨짐 방지
- **엣지 케이스**: 없음

### MVP 이후 기능 (스코프 제외)

- 사용자 인증/로그인
- 책/아티클 상세 페이지
- 검색 기능 (제목/저자/카테고리)
- 소셜 공유 버튼 (Twitter/Facebook OG 태그)
- 페이지네이션 또는 무한 스크롤
- 책 추가/수정 (웹 폼)
- 통계 대시보드 (완독 수, 월별 독서량)

---

## 4. 메뉴 구조

```
헤더 내비게이션
└── 독서 기록 (로고/홈) — F001, F002

탭 내비게이션 (독서 목록 페이지 내)
├── 전체 — F002
├── 읽는중 — F002
├── 완독 — F002
└── 읽을예정 — F002
```

> 이 서비스는 단일 페이지 구성으로 별도 메뉴 탐색 없음.
> 헤더는 서비스 타이틀과 다크모드 토글만 포함.

---

## 5. 페이지별 상세 기능

### 독서 목록 페이지

| 항목             | 내용                                                                                                |
| ---------------- | --------------------------------------------------------------------------------------------------- |
| **역할**         | 노션 DB에서 가져온 독서/아티클 기록을 상태별로 필터링하여 카드 그리드로 표시하는 서비스 핵심 페이지 |
| **사용자 행동**  | 탭 클릭으로 상태 필터 적용, 카드로 제목/저자/평점/카테고리 확인                                     |
| **진입 조건**    | 루트 경로(`/`) 직접 접속 또는 공유 링크 클릭                                                        |
| **기능 목록**    | 전체 목록 카드 그리드 표시, 상태별 탭 필터링, 로딩 스켈레톤, 반응형 레이아웃, 에러 배너             |
| **구현 기능 ID** | F001, F002, F003, F004                                                                              |
| **다음 이동**    | 없음 (단일 페이지 서비스)                                                                           |

**레이아웃 구성**:

```
┌────────────────────────────────────────────────┐
│  [로고/타이틀]              [다크모드 토글]    │  ← Header
├────────────────────────────────────────────────┤
│  독서 기록                                     │  ← Hero 타이틀
│  N권 완독 · N권 읽는중                         │  ← 통계 요약 (F001 데이터 기반 계산)
├────────────────────────────────────────────────┤
│  [전체] [읽는중] [완독] [읽을예정]             │  ← 탭 필터
├────────────────────────────────────────────────┤
│  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐       │
│  │ 표지  │ │ 표지  │ │ 표지  │ │ 표지  │       │  ← 카드 그리드
│  │ 제목  │ │ 제목  │ │ 제목  │ │ 제목  │       │
│  │ 저자  │ │ 저자  │ │ 저자  │ │ 저자  │       │
│  │ ★★★   │ │ ★★★   │ │ ★★★   │ │ ★★★   │       │
│  │ 태그  │ │ 태그  │ │ 태그  │ │ 태그  │       │
│  └───────┘ └───────┘ └───────┘ └───────┘       │
├────────────────────────────────────────────────┤
│  © 2026 독서 기록                              │  ← Footer
└────────────────────────────────────────────────┘
```

**카드 구성 요소**:

- 표지 이미지 (없으면 플레이스홀더) — 외부 URL이므로 `<img>` 태그 사용 (`next/image`는 외부 도메인 설정 필요하여 MVP에서 제외)
- 제목 (2줄 말줄임)
- 저자 (1줄 말줄임)
- 상태 Badge (`읽는중` / `완독` / `읽을예정`)
- 평점 (별 아이콘, 없으면 미표시)
- 카테고리 Badge (있으면 표시)

---

## 6. 데이터 모델

### Notion DB 속성 스키마

| 속성명      | Notion 타입    | 필수 | 설명                     |
| ----------- | -------------- | ---- | ------------------------ |
| 제목        | `title`        | O    | 책/아티클 제목           |
| 저자        | `rich_text`    | X    | 저자명                   |
| 상태        | `select`       | O    | 읽는중 / 완독 / 읽을예정 |
| 평점        | `number`       | X    | 1~5 정수                 |
| 메모        | `rich_text`    | X    | 독서 메모/감상           |
| 표지 이미지 | `url`          | X    | 표지 이미지 URL          |
| 카테고리    | `multi_select` | X    | 개발 / 인문 / 과학 등    |
| 등록일      | `date`         | X    | 등록/완독 날짜           |

### TypeScript 타입 정의

```typescript
// src/features/reading/types/index.ts

export type ReadingStatus = "읽는중" | "완독" | "읽을예정";

export type StatusFilter = "all" | "reading" | "done" | "planned";

export const STATUS_MAP: Record<ReadingStatus, StatusFilter> = {
	읽는중: "reading",
	완독: "done",
	읽을예정: "planned"
};

export type ReadingItem = {
	id: string;
	title: string;
	author: string | null;
	status: ReadingStatus;
	rating: number | null; // 1~5, null이면 미표시
	memo: string | null;
	coverImageUrl: string | null;
	categories: string[];
	registeredAt: string | null; // ISO 8601 날짜 문자열
};

export type ReadingListData = {
	items: ReadingItem[];
	fetchedAt: string; // 캐시 시각 (디버깅용)
};
```

### Notion API 응답 → ReadingItem 매핑

```typescript
// src/features/reading/services/notionMapper.ts

// Notion PageObjectResponse → ReadingItem 변환 로직
// properties['제목'].title[0].plain_text
// properties['저자'].rich_text[0]?.plain_text ?? null
// properties['상태'].select?.name as ReadingStatus
// properties['평점'].number ?? null
// properties['표지 이미지'].url ?? null
// properties['카테고리'].multi_select.map(s => s.name)
// properties['등록일'].date?.start ?? null
```

---

## 7. API 설계 (Notion API 통합)

### 호출 방식

- **호출 위치**: `src/features/reading/services/notionClient.ts` (Server 전용)
- **클라이언트 노출 금지**: 이 파일은 `"use client"` 없이 작성, 브라우저에서 직접 호출 불가
- **SDK**: `@notionhq/client`

### 쿼리 구성

```typescript
// 노션 DB 전체 조회 (상태 필터 없이 전체 가져옴, 클라이언트에서 필터링)
const response = await notion.databases.query({
	database_id: process.env.NOTION_DATABASE_ID!,
	sorts: [{ property: "등록일", direction: "descending" }],
	page_size: 100
});
```

### 캐싱 전략

Next.js 16에서는 `use cache` 디렉티브를 사용하여 서버 사이드 캐싱을 적용합니다.

```typescript
// src/features/reading/services/notionClient.ts
import { cacheLife } from "next/cache";

export async function fetchReadingList(): Promise<ReadingListData> {
	"use cache";
	cacheLife("hours"); // 1시간마다 재검증

	const response = await notion.databases.query({
		database_id: process.env.NOTION_DATABASE_ID!,
		sorts: [{ property: "등록일", direction: "descending" }],
		page_size: 100
	});

	return {
		items: response.results.map(mapPageToReadingItem),
		fetchedAt: new Date().toISOString()
	};
}
```

- **`use cache` 디렉티브**: Next.js 16 공식 권장 캐싱 방식 (`unstable_cache` 대체)
- **`cacheLife("hours")`**: 1시간 주기 재검증 프리셋
- **수동 재검증**: `revalidateTag('reading-list')` — MVP에서 지원 안 함 (향후 웹훅 연동 시 추가)

---

## 8. 프로젝트 구조

```
src/
├── app/
│   ├── layout.tsx              # 기존 루트 레이아웃 (Header, Footer 포함)
│   ├── page.tsx                # 독서 목록 페이지 진입점 (Server Component, Suspense 경계 포함)
│   ├── loading.tsx             # 스켈레톤 UI (F003)
│   └── error.tsx               # 에러 UI (구조화된 에러 로깅)
│
├── features/
│   └── reading/
│       ├── components/
│       │   ├── ReadingBoard.tsx         # 탭 + 카드 그리드 컨테이너 ("use client")
│       │   ├── ReadingCard.tsx          # 개별 도서/아티클 카드
│       │   ├── ReadingCardSkeleton.tsx  # 카드 스켈레톤
│       │   ├── StarRating.tsx           # 별점 표시 (1~5점)
│       │   ├── StatsSummary.tsx         # 상태별 통계 요약 (N권 전체/완독/읽는중)
│       │   ├── StatusTabItem.tsx        # 개별 탭 버튼
│       │   ├── StatusTabs.tsx           # 상태 필터 탭 ("use client")
│       │   └── EmptyState.tsx           # 빈 상태 메시지
│       ├── services/
│       │   ├── notionClient.ts          # Notion API 호출 (Server 전용, Rate Limiting 적용)
│       │   └── notionMapper.ts          # API 응답 → ReadingItem 변환
│       ├── utils/
│       │   └── statusFilter.ts          # 필터 검증, 상태 카운트, 항목 필터링
│       └── types/
│           └── index.ts                 # ReadingItem, ReadingStatus 등
│
└── shared/
    └── utils/
        ├── cn.ts                        # Tailwind 클래스 병합 유틸
        ├── logger.ts                    # 구조화된 JSON 로거 (info/warn/error)
        └── rateLimiter.ts               # 슬라이딩 윈도우 Rate Limiter
```

### 컴포넌트 역할 분리

| 컴포넌트        | 렌더링       | 역할                                          |
| --------------- | ------------ | --------------------------------------------- |
| `app/page.tsx`  | Server       | Notion API 호출, `ReadingBoard`에 데이터 전달 |
| `ReadingBoard`  | Client       | URL 쿼리 파라미터 읽기/쓰기, 필터 상태 관리   |
| `StatusTabs`    | Client       | 탭 목록 렌더링 및 필터 변경 콜백 전달         |
| `StatusTabItem` | Client (주1) | 개별 탭 버튼 UI 및 클릭 핸들링                |
| `StatsSummary`  | Client (주1) | 상태별 통계 요약 (N권 전체/완독/읽는중)       |
| `ReadingCard`   | Client (주1) | 카드 UI 렌더링 (순수 표현 컴포넌트)           |
| `StarRating`    | Client (주1) | 별점 아이콘 렌더링 (1~5점)                    |
| `EmptyState`    | Client (주1) | 필터별 빈 상태 메시지 표시                    |
| `notionClient`  | Server only  | `@notionhq/client` SDK 호출                   |

> **주1**: `"use client"` 선언이 없는 순수 표현 컴포넌트이지만, Client Component 하위에서 렌더링되므로 실제로는 Client로 동작합니다.

---

## 9. 환경 변수

```bash
# .env.local (로컬 개발)
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

| 변수명               | 설명                          | 필수 |
| -------------------- | ----------------------------- | ---- |
| `NOTION_API_KEY`     | Notion Integration Secret Key | O    |
| `NOTION_DATABASE_ID` | 독서 기록 Database ID         | O    |

**설정 방법**:

1. [Notion Integrations](https://www.notion.so/my-integrations)에서 통합 생성
2. 독서 DB 페이지에서 통합 연결 ("연결 추가")
3. DB URL에서 `database_id` 추출 (`notion.so/[workspace]/[database_id]?v=...`)

---

## 10. 의존성 추가

```bash
pnpm add @notionhq/client
```

| 패키지             | 버전   | 용도           |
| ------------------ | ------ | -------------- |
| `@notionhq/client` | `^2.x` | Notion API SDK |

기존 패키지에서 활용:

- `lucide-react` — Star 평점 아이콘, 빈 상태 아이콘
- `clsx` + `tailwind-merge` → `cn()` — 조건부 클래스
- 기존 UI 컴포넌트: `Card`, `Badge`, `Skeleton` (직접 경로 import: `from "@/shared/ui/Card"` 등)

---

## 11. 수용 기준 (Acceptance Criteria)

### F001 — 독서 목록 조회

- [ ] 페이지 접속 시 Notion DB의 항목이 카드로 렌더링된다
- [ ] 등록일 내림차순으로 정렬되어 표시된다
- [ ] API 호출 실패 시 에러 UI(`error.tsx`)가 표시된다
- [ ] 빈 DB일 경우 빈 상태 메시지가 표시된다

### F002 — 상태별 필터링

- [ ] 탭 클릭 시 해당 상태 항목만 표시된다
- [ ] "전체" 탭 선택 시 모든 항목이 표시된다
- [ ] URL 쿼리 파라미터(`?status=reading`)로 필터가 반영된다
- [ ] 페이지 새로고침/공유 링크로 접속 시 해당 필터가 유지된다
- [ ] 유효하지 않은 `status` 값은 "전체"로 폴백된다

### F003 — 로딩 스켈레톤

- [ ] 서버 데이터 패칭 중 카드 형태의 스켈레톤이 표시된다
- [ ] 스켈레톤과 실제 카드의 크기/레이아웃이 일치한다

### F004 — 반응형 카드 그리드

- [ ] 모바일(< 640px): 1열 그리드
- [ ] 태블릿(640px~): 2열 그리드
- [ ] 데스크톱(1024px~): 3열 그리드
- [ ] 와이드(1280px~): 4열 그리드

### 정합성 검증

- [ ] 기능 명세 F001~F004 전부 독서 목록 페이지에서 구현됨
- [ ] 메뉴 구조의 탭 항목 4개가 모두 F002로 연결됨
- [ ] 페이지별 상세 기능의 구현 기능 ID가 기능 명세와 일치함

---

## 12. 향후 확장 (Post-MVP)

| 기능         | 설명                                 |
| ------------ | ------------------------------------ |
| 상세 페이지  | 카드 클릭 → 메모/감상 전체 내용 열람 |
| 검색         | 제목/저자/카테고리 키워드 검색       |
| 페이지네이션 | 100개 초과 항목 처리                 |
| Notion 웹훅  | 노션 데이터 변경 시 자동 revalidate  |
| OG 메타 태그 | 소셜 공유 시 미리보기 이미지         |
| RSS 피드     | 독서 기록 RSS 구독                   |
| 통계         | 월별 독서량, 카테고리별 분포 차트    |

---

## 정합성 검증 체크리스트

### 1단계: 기능 명세 → 페이지 연결 검증

- [x] F001 → 독서 목록 페이지 (구현 기능 ID에 포함)
- [x] F002 → 독서 목록 페이지 (구현 기능 ID에 포함)
- [x] F003 → 독서 목록 페이지 (구현 기능 ID에 포함)
- [x] F004 → 독서 목록 페이지 (구현 기능 ID에 포함)

### 2단계: 메뉴 구조 → 페이지 연결 검증

- [x] 탭 내비게이션 4개 항목 모두 → 독서 목록 페이지 F002
- [x] 헤더 로고 → F001 (독서 목록 페이지 홈)

### 3단계: 페이지별 상세 기능 → 역참조 검증

- [x] 독서 목록 페이지의 구현 기능 ID (F001, F002, F003, F004) 전부 기능 명세에 정의됨
- [x] 독서 목록 페이지는 헤더 메뉴(로고)에서 접근 가능

### 4단계: 누락 및 고아 항목 검증

- [x] 기능 명세에만 있고 페이지 미구현 기능 없음
- [x] 페이지에만 있고 기능 명세 미정의 기능 없음
- [x] 메뉴에만 있고 실제 페이지 없는 항목 없음
