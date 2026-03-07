# Development Roadmap

> Generated from PRD: `docs/PRD.md`
> Last updated: 2026-03-05

## 개요

readboard는 노션 데이터베이스에 기록한 책/아티클을 공개 웹 페이지로 자동 노출하는 1인 독서 기록 공유 서비스이다.
MVP는 단일 페이지(독서 목록)로 구성되며, Notion API 연동 -> UI 컴포넌트 구현 -> 페이지 통합 -> 검증 순서로 진행한다.

## 페이즈 요약

| Phase   | 목표                     | 주요 기능                                     | 복잡도 | 선행 조건                         |
| ------- | ------------------------ | --------------------------------------------- | ------ | --------------------------------- |
| Phase 1 | 기반 구조 및 타입 시스템 | 프로젝트 스캐폴딩, 타입 정의                  | Low    | 없음                              |
| Phase 2 | Notion API 연동          | SDK 설치, API 클라이언트, 데이터 매퍼         | Medium | Phase 1                           |
| Phase 3 | 카드 UI 컴포넌트         | ReadingCard, ReadingCardSkeleton, EmptyState  | Medium | Phase 1 (**Phase 2와 병렬 가능**) |
| Phase 4 | 필터링 및 보드 컴포넌트  | StatusTabs, ReadingBoard, URL 쿼리 연동       | High   | Phase 3                           |
| Phase 5 | 페이지 통합 및 완성      | page.tsx 통합, loading.tsx 연결, 통계 요약    | Medium | Phase 2 + Phase 4                 |
| Phase 6 | 검증 및 품질 보증        | Playwright 테스트, 반응형 검증, 에러 시나리오 | Medium | Phase 5                           |

---

## 개발 워크플로우

### 작업 구현 (구현 → 테스트 → 검증 필수 사이클)

모든 Task는 아래 사이클을 반복한다. **테스트 통과 없이 다음 단계 진행 금지**.

1. **구현** — Task 파일의 명세서에 따라 기능 구현
2. **테스트** — 개발 서버 실행 → Playwright MCP로 E2E 테스트
3. **검증** — 테스트 결과를 Task 파일의 `## 테스트 결과` 섹션에 기록
4. **진행** — 모든 테스트 통과 확인 후 다음 단계로 이동

**API 연동 Task 필수 테스트 (3종):**

- Happy Path: 정상 요청 → 기대 응답 확인
- 에러 시나리오: 잘못된 입력, 네트워크 오류, 타임아웃 처리
- 엣지 케이스: 빈 데이터, 대량 데이터, 특수 문자 등

**비즈니스 로직 Task 필수 테스트 (3종):**

- 입력 검증: 유효/무효 입력에 대한 처리 확인
- 데이터 변환: 입력 → 출력 매핑 정확성
- 상태 전이: 상태 변경 흐름의 정확성

---

## 테스트 전략 (Playwright MCP)

### 테스트 분류

| 분류                         | 대상                                              | 도구           |
| ---------------------------- | ------------------------------------------------- | -------------- |
| **API 통합 테스트**          | API 엔드포인트 응답, 데이터 정합성, 에러 처리     | Playwright MCP |
| **UI 인터랙션 테스트**       | 버튼 클릭, 폼 입력, 탭 전환 등 사용자 조작        | Playwright MCP |
| **E2E 사용자 플로우 테스트** | 페이지 접속 → 필터링 → 결과 확인 등 전체 시나리오 | Playwright MCP |
| **에러/엣지 케이스 테스트**  | 네트워크 오류, 빈 데이터, 잘못된 쿼리 파라미터    | Playwright MCP |

### Playwright MCP 실행 절차

1. **navigate** — 대상 페이지로 이동
2. **snapshot** — 현재 페이지 상태 캡처 및 요소 확인
3. **검증** — 기대 요소 존재 여부, 텍스트 내용, 상태 확인
4. **인터랙션** — 클릭, 입력, 스크롤 등 사용자 행동 시뮬레이션
5. **결과 기록** — 테스트 통과/실패 여부를 Task 파일에 기록

### 테스트 완료 기준

- 모든 테스트 항목 통과 (체크리스트 100% 완료)
- 테스트 결과가 Task 파일의 `## 테스트 결과` 섹션에 문서화
- **테스트 미완료 Task는 완료 상태로 전환 불가**

---

## TDD (Test-Driven Development)

새로운 기능 코드는 **Red → Green → Refactor** 사이클을 따른다:

1. **Red** — 실패하는 테스트를 먼저 작성 (기대 동작 정의)
2. **Green** — 테스트를 통과하는 최소한의 코드 작성
3. **Refactor** — 테스트 통과를 유지하면서 코드 정리 및 개선

**적용 범위:** 서비스 함수 (`notionClient.ts`, `notionMapper.ts`), 데이터 변환 로직, 비즈니스 규칙 (유효성 검사, 상태 관리)
**제외 범위:** 순수 UI 컴포넌트 (Playwright MCP로 E2E 테스트), 설정 파일, 타입 정의 (TypeScript strict 모드로 검증)

---

## 테스트 트로피 전략 (Testing Trophy)

```
        ╱  E2E  ╲           ← 핵심 사용자 플로우 (Playwright MCP)
       ╱─────────╲
      ╱ Integration╲        ← 최다 투자 (Playwright MCP)
     ╱───────────────╲
    ╱   Unit Tests    ╲     ← 순수 함수, 유틸리티
   ╱───────────────────╲
  ╱   Static Analysis   ╲   ← TypeScript strict, ESLint
 ╱─────────────────────────╲
```

1. **Integration Tests (최다 투자)**: Notion API 연동, 컴포넌트 간 데이터 흐름, 서비스 레이어 통합 → Playwright MCP 활용
2. **E2E Tests**: 핵심 사용자 플로우 검증 (F001~F004 Happy Path + 주요 에러 시나리오) → Playwright MCP 활용
3. **Unit Tests**: `notionMapper.ts` 변환 로직, 유틸리티 함수 → 단위 테스트
4. **Static Analysis (기반)**: TypeScript strict 모드, ESLint → `pnpm type:check`, `pnpm lint`

**핵심 원칙:** 단위 테스트보다 통합 테스트에 더 많이 투자하여 실제 사용자 경험에 가까운 검증을 우선한다.

---

## Phase 1: 기반 구조 및 타입 시스템

**목표:** 프로젝트 스캐폴딩과 도메인 타입이 정의되어 후속 개발의 기초가 마련된다
**선행 조건:** 없음
**순서 근거:** 타입과 디렉토리 구조는 모든 후속 Phase의 공통 기반이므로 최우선 배치
**완료 기준:** `src/features/reading/` 디렉토리 구조가 생성되고, 모든 타입이 정의된다

### 태스크

- [x] Task 001: `ReadingStatus`, `StatusFilter`, `STATUS_MAP`, `ReadingItem`, `ReadingListData` 타입 정의 (`src/features/reading/types/index.ts`)
- [x] ~~Task 002: 배럴 파일 생성~~ (컨벤션 변경으로 삭제됨 — 배럴 파일 사용 금지, 직접 경로 import)
- [x] ~~Task 003: 루트 배럴 파일 생성~~ (컨벤션 변경으로 삭제됨)
- [x] Task 004: `src/app/error.tsx` 에러 바운더리 페이지 기본 구현
- [x] Task 005: `src/app/loading.tsx` 로딩 페이지 기본 구조 생성

### 기술 노트

- 타입 정의는 PRD 6절 데이터 모델을 그대로 반영한다
- 배럴 파일(index.ts) 사용 금지 — 항상 직접 경로로 import (`from "@/shared/ui/Badge"` 등)
- shadcn 컴포넌트 커스터마이징 규칙은 `.claude/rules/shadcn.md` 참조

---

## Phase 2: Notion API 연동

**목표:** Notion 데이터베이스에서 독서 기록을 가져와 `ReadingItem[]`으로 변환하는 서버 사이드 데이터 레이어가 완성된다
**선행 조건:** Phase 1 완료
**순서 근거:** 서비스 레이어(데이터 소스)를 먼저 확보해야 Phase 5 통합 시 실제 데이터로 검증 가능. Phase 3과 병렬 진행 가능
**완료 기준:** `fetchReadingList()` 호출 시 Notion DB 데이터가 `ReadingListData` 형태로 반환되고, `use cache` 캐싱이 적용된다

### 태스크

- [ ] Task 006: `@notionhq/client` 패키지 설치 (`pnpm add @notionhq/client`)
- [ ] Task 007: `.env.local`에 `NOTION_API_KEY`, `NOTION_DATABASE_ID` 환경 변수 설정 및 `.env.example` 파일 생성
- [ ] Task 008: `notionMapper.ts`에 `mapPageToReadingItem()` 함수 구현 (`src/features/reading/services/notionMapper.ts`)
  - Notion `PageObjectResponse`를 `ReadingItem`으로 변환
  - 한글 속성명(`제목`, `저자`, `상태`, `평점`, `표지 이미지`, `카테고리`, `등록일`) 매핑
  - 누락 필드에 대한 null 폴백 처리
- [ ] Task 009: `notionClient.ts`에 Notion SDK 초기화 및 `fetchReadingList()` 함수 구현 (`src/features/reading/services/notionClient.ts`)
  - `use cache` 디렉티브 적용
  - `cacheLife("hours")` 설정 (1시간 재검증)
  - `등록일` 기준 내림차순 정렬, `page_size: 100`
  - `mapPageToReadingItem` 호출하여 결과 변환
- [ ] Task 010: 환경 변수 미설정 시 빌드 타임 오류를 발생시키는 검증 로직 추가 (`src/features/reading/services/notionClient.ts`)

### 기술 노트

- `notionClient.ts`는 `"use client"` 선언 없이 Server 전용으로 유지한다
- `use cache`는 Next.js 16 공식 캐싱 방식이며, `cacheLife` import는 `next/cache`에서 가져온다
- Notion API 응답의 `results`는 `PageObjectResponse | PartialPageObjectResponse` 유니온이므로 타입 가드가 필요하다

### Playwright 테스트 (API 연동 Task 체크리스트)

- [ ] Task 011: Notion API 연동 후 페이지 접속 시 데이터가 렌더링되는지 기본 검증 (Phase 5 통합 후 실행)
  - [ ] Happy Path: 정상 API 응답 시 카드 목록이 올바르게 렌더링되는지 확인
  - [ ] 에러 시나리오: API 키 누락/잘못된 DB ID 시 에러 UI 표시 확인
  - [ ] 엣지 케이스: 빈 DB(항목 0개) 시 EmptyState 표시 확인
  - [ ] 로딩 상태: 데이터 fetching 중 스켈레톤 UI 표시 확인

---

## Phase 3: 카드 UI 컴포넌트

**목표:** 독서 기록을 표시하는 카드 컴포넌트와 로딩/빈 상태 컴포넌트가 완성된다
**선행 조건:** Phase 1 완료 (타입 정의 필요)
**순서 근거:** Phase 1의 타입만 의존하므로 Phase 2(API)와 병렬 진행 가능. UI 컴포넌트가 Phase 4(보드 조합)의 전제 조건
**완료 기준:** `ReadingCard`가 표지/제목/저자/상태Badge/평점/카테고리를 올바르게 렌더링하고, `ReadingCardSkeleton`이 카드와 동일한 레이아웃을 유지한다

### 태스크

- [ ] Task 012: `ReadingCard` 컴포넌트 구현 (`src/features/reading/components/ReadingCard.tsx`)
  - `Card` 컴포넌트(`src/shared/ui/Card.tsx`) 기반으로 구성
  - 표지 이미지: `<img>` 태그 사용 (외부 URL), 없으면 플레이스홀더 배경
  - 제목: 2줄 말줄임 (`line-clamp-2`)
  - 저자: 1줄 말줄임 (`line-clamp-1`)
  - 상태: `Badge` 컴포넌트(`src/shared/ui/Badge.tsx`) 사용
  - 평점: `lucide-react`의 `Star` 아이콘, `rating`이 null이면 미표시
  - 카테고리: `Badge` 컴포넌트로 각 카테고리 표시
- [ ] Task 013: `ReadingCardSkeleton` 컴포넌트 구현 (`src/features/reading/components/ReadingCardSkeleton.tsx`)
  - `Skeleton` 컴포넌트(`src/shared/ui/Skeleton.tsx`) 재사용
  - `ReadingCard`와 동일한 높이/레이아웃 구조 유지
  - 이미지 영역, 제목, 저자, Badge 위치에 스켈레톤 배치
- [ ] Task 014: `EmptyState` 컴포넌트 구현 보강 (`src/features/reading/components/EmptyState.tsx`)
  - `lucide-react` 아이콘 추가 (예: `BookOpen`)
  - 필터별 메시지 분기: 전체 탭("아직 등록된 항목이 없습니다") / 특정 상태 탭("이 상태의 항목이 없습니다")
  - `StatusFilter`를 prop으로 받아 메시지를 결정하도록 변경

### 기술 노트

- `ReadingCard`는 `"use client"` 선언 없이 순수 표현 컴포넌트로 유지한다 (Client Component인 `ReadingBoard` 하위에서 렌더링)
- 표지 이미지에 `next/image` 대신 `<img>` 태그를 사용한다 (외부 도메인 설정 회피, PRD 명시)
- `Card` 복합 컴포넌트는 `Object.assign` 패턴을 사용한다 (각 서브컴포넌트도 Props type 별도 선언, `.claude/rules/shadcn.md` 참조)

---

## Phase 4: 필터링 및 보드 컴포넌트

**목표:** 상태별 탭 필터링이 URL 쿼리 파라미터와 동기화되어 동작하고, 카드 그리드가 반응형으로 표시된다
**선행 조건:** Phase 3 완료
**순서 근거:** ReadingCard(Phase 3)를 조합하여 보드를 구성하므로 카드 컴포넌트 완성 후 진행. 필터링 로직은 클라이언트 사이드이므로 API(Phase 2)와 독립적
**완료 기준:** 탭 클릭 시 URL이 `?status=reading` 형태로 변경되고, 해당 상태의 카드만 필터링되며, 새로고침/공유 링크 접속 시 필터가 유지된다

### 태스크

- [ ] Task 015: `StatusTabs` 컴포넌트 구현 (`src/features/reading/components/StatusTabs.tsx`)
  - 탭 목록: 전체(`all`) / 읽는중(`reading`) / 완독(`done`) / 읽을예정(`planned`)
  - 각 탭에 해당 상태 항목 수 표시 (예: "완독 (12)")
  - 현재 선택 탭 시각적 구분 (active 스타일)
  - `onFilterChange` 콜백으로 선택 상태 전달
- [ ] Task 016: `ReadingBoard` 컴포넌트 구현 (`src/features/reading/components/ReadingBoard.tsx`)
  - `useSearchParams()`로 URL의 `status` 쿼리 파라미터 읽기
  - `useRouter().replace()`로 탭 변경 시 URL 쿼리 파라미터 업데이트 (스크롤 유지)
  - 유효하지 않은 `status` 값은 `"all"`로 폴백
  - `STATUS_MAP`을 활용한 클라이언트 사이드 필터링 로직
  - 필터링된 항목이 없을 때 `EmptyState` 표시
  - 반응형 그리드: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
  - `StatusTabs`와 `ReadingCard` 조합 렌더링
- [ ] Task 017: `ReadingBoard`를 `Suspense` 경계로 감싸는 구조 확인 (`src/app/page.tsx`)
  - `useSearchParams()` 사용 컴포넌트는 `<Suspense>`로 감싸야 정적 생성이 보장됨 (PRD F002 비즈니스 규칙)

### 기술 노트

- 필터링은 서버 재호출 없이 클라이언트에서 수행한다 (전체 데이터를 props로 받아 필터링)
- `useSearchParams()`는 `"use client"` 필수이며, `Suspense` 경계 내에서 사용해야 한다
- `ReadingBoard`의 items prop은 Server Component(`page.tsx`)에서 전달한다

### Playwright 테스트 (비즈니스 로직 Task 체크리스트)

- [ ] Task 018: 탭 클릭 시 URL 쿼리 파라미터 변경 및 카드 필터링 검증
  - [ ] 입력 검증: 4개 탭(전체/읽는중/완독/읽을예정) 각각 클릭 시 올바른 필터링
  - [ ] 상태 전이: 탭 전환 시 URL `?status=` 파라미터 정확히 변경되는지 확인
  - [ ] 데이터 변환: 필터링된 카드 수와 탭의 카운트 숫자 일치 확인
- [ ] Task 019: 유효하지 않은 `?status=invalid` 접속 시 "전체" 탭 폴백 검증
  - [ ] 엣지 케이스: 빈 문자열, 숫자, 특수문자 등 다양한 무효 값 테스트
- [ ] Task 020: 특정 `?status=done` URL 직접 접속 시 해당 필터 유지 검증
  - [ ] Happy Path: URL 공유 링크로 직접 접속 시 필터 상태 유지
  - [ ] 새로고침 시 필터 상태 유지 확인

---

## Phase 5: 페이지 통합 및 완성

**목표:** 모든 컴포넌트가 `page.tsx`에 통합되어 MVP 기능(F001~F004)이 동작하는 완성된 페이지가 배포 가능한 상태가 된다
**선행 조건:** Phase 2, Phase 4 완료
**순서 근거:** 서비스 레이어(Phase 2)와 UI 레이어(Phase 3~4) 양쪽이 모두 완성된 후 통합. 더미 데이터를 실제 API로 교체하는 시점
**완료 기준:** 루트 경로(`/`) 접속 시 Notion DB 데이터가 카드 그리드로 표시되고, 탭 필터링/로딩/에러/빈 상태가 모두 정상 동작한다

### 태스크

- [ ] Task 021: `page.tsx` 통합 완성 (`src/app/page.tsx`)
  - `fetchReadingList()` 호출 후 `ReadingBoard`에 데이터 전달
  - 통계 요약 렌더링: "N권 완독 / N권 읽는중" (서버에서 items 기반 계산)
  - `Suspense` fallback을 `loading.tsx`의 스켈레톤 패턴과 일치시키기
- [ ] Task 022: `loading.tsx`에서 `ReadingCardSkeleton` 12개 그리드 렌더링 확인 및 실제 카드 레이아웃과 정합성 검증 (`src/app/loading.tsx`)
- [ ] Task 023: `error.tsx` 에러 UI에서 "다시 시도" 버튼 동작 검증 (`src/app/error.tsx`)
- [ ] Task 024: Header 컴포넌트에 서비스 타이틀 및 다크모드 토글 반영 확인 (`src/shared/layouts/Header.tsx`)
- [ ] Task 025: Footer 컴포넌트에 저작권 표시 반영 확인 (`src/shared/layouts/Footer.tsx`)

### 기술 노트

- `page.tsx`는 Server Component로 유지하며 데이터 패칭을 직접 수행한다
- 통계 요약은 별도 컴포넌트 없이 `page.tsx` 내에서 인라인으로 계산/렌더링해도 충분하다 (MVP)
- `Suspense` fallback과 `loading.tsx`의 역할이 중복될 수 있으므로 정리가 필요하다

---

## Phase 6: 검증 및 품질 보증

**목표:** MVP 수용 기준(Acceptance Criteria) 전체를 검증하고, 반응형/다크모드/에러 시나리오가 정상 동작함을 확인한다
**선행 조건:** Phase 5 완료
**순서 근거:** 모든 기능이 통합된 후에야 E2E 테스트와 수용 기준 검증이 의미를 가짐. 테스트 트로피 전략의 최상위 계층(E2E) 실행 시점
**완료 기준:** PRD 11절의 수용 기준 체크리스트가 전부 통과하고, `pnpm build`가 에러 없이 완료된다

### 태스크

- [ ] Task 026: `pnpm build` 프로덕션 빌드 성공 검증
- [ ] Task 027: `pnpm type:check` TypeScript 타입 검사 통과 검증
- [ ] Task 028: `pnpm lint` ESLint 검사 통과 검증

### Playwright 테스트 (E2E 사용자 플로우 + 에러/엣지 케이스)

- [ ] Task 029: F001 검증 -- 페이지 접속 시 카드 렌더링 및 등록일 내림차순 정렬 확인
  - [ ] Happy Path: Notion DB 데이터가 카드 그리드로 정상 표시
  - [ ] 데이터 정합성: 제목, 저자, 상태, 평점, 카테고리가 Notion 원본과 일치
- [ ] Task 030: F002 검증 -- 4개 탭 각각 클릭 시 필터링 동작 확인
  - [ ] 각 탭 클릭 → 해당 상태 카드만 표시 → 카운트 일치
- [ ] Task 031: F003 검증 -- 초기 로드 시 스켈레톤 UI 표시 후 실제 카드로 전환 확인
- [ ] Task 032: F004 검증 -- 뷰포트 크기별 그리드 열 수 확인 (모바일 1열, 태블릿 2열, 데스크톱 3열, 와이드 4열)
  - [ ] 각 뷰포트에서 browser_resize → snapshot → 열 수 검증
- [ ] Task 033: 빈 DB 시나리오 -- EmptyState 메시지 표시 확인
  - [ ] 전체 탭: "아직 등록된 항목이 없습니다" 메시지
  - [ ] 특정 상태 탭: "이 상태의 항목이 없습니다" 메시지
- [ ] Task 034: 다크모드 전환 시 모든 컴포넌트의 시각적 정합성 확인
- [ ] Task 035: Static Analysis 최종 검증 -- `pnpm type:check` + `pnpm lint` 통과 (테스트 트로피 기반층)

---

## 리스크 및 고려사항

### 기술적 리스크

| 리스크                      | 영향도               | 완화 방안                                                                   |
| --------------------------- | -------------------- | --------------------------------------------------------------------------- |
| Notion API 속도 저하        | 초기 로드 지연       | `use cache` + `cacheLife("hours")` 캐싱으로 반복 호출 최소화                |
| Notion API 속성명 변경      | 데이터 매핑 실패     | `notionMapper.ts`에서 속성 누락 시 null 폴백 처리, 에러 로깅                |
| `use cache` 디렉티브 안정성 | Next.js 16 신규 기능 | 공식 문서 확인 후 적용, 문제 시 `unstable_cache` 폴백 가능                  |
| 외부 표지 이미지 URL 만료   | 이미지 깨짐          | Notion 파일 URL은 만료될 수 있으므로, `url` 타입 속성 사용 권장 (만료 없음) |
| 100개 초과 항목             | 데이터 누락          | MVP 범위에서 페이지네이션 미지원 명시, Post-MVP에서 대응                    |

### 의존성 관계

```
Phase 1 (타입/구조) ───────────────────────────────┐
    |                                              |
    v                                              v
Phase 2 (API 연동)                    Phase 3 (카드 UI)
    |                                              |
    |                                              v
    |                                 Phase 4 (필터링/보드)
    |                                              |
    └──────────────┬───────────────────────────────┘
                   v
           Phase 5 (페이지 통합)
                   |
                   v
           Phase 6 (검증)
```

- Phase 2(API 연동)와 Phase 3(카드 UI)는 Phase 1 완료 후 **병렬 진행 가능**하다
- Phase 4(필터링/보드)는 Phase 3의 카드 컴포넌트가 완성되어야 시작할 수 있다
- Phase 5(통합)는 Phase 2와 Phase 4 모두 완료되어야 한다
