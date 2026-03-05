# 코드 컨벤션

작업 전 관련 코드를 먼저 탐색하여 기존 패턴을 파악하고 따르세요.

## 컴포넌트

- Props는 별도 type으로 선언 (인라인 타입 금지)
- 파일당 하나의 컴포넌트만 export (Props 미노출, `ComponentProps<typeof C>` 사용)
- 배럴 파일(index.ts)은 컴포넌트만 re-export (타입 re-export 금지, 도메인 타입은 예외)
- 복합 컴포넌트: `Object.assign` 패턴 — 서브 함수/타입에 부모 prefix 필수
- `"use client"`: hooks/browser API/이벤트 핸들러 직접 사용 시에만
- 무거운 클라이언트 컴포넌트는 `next/dynamic`으로 지연 로딩

## CSS/스타일

- 전역 CSS: `src/shared/styles/` (globals → tokens, base, animations import)
- 폰트: `src/shared/fonts/`, `next/font/local`로 로드
- Tailwind 기본 클래스가 있으면 임의값 금지: `min-w-[8rem]` → `min-w-32`

## 테마

- 클래스 기반 다크모드 (.dark), ThemeScript로 FOUC 방지
- `theme-transitioning` 클래스로 전환 시 transition
- `useSyncExternalStore`로 localStorage/matchMedia 관리
