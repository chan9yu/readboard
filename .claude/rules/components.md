---
description: React 컴포넌트 작성 규칙
paths: ["src/**/*.tsx"]
---

# 컴포넌트 컨벤션

- Props는 별도 type으로 선언 (인라인 타입 금지)
- 파일당 하나의 컴포넌트만 export (Props 미노출, `ComponentProps<typeof C>` 사용)
- 배럴 파일(index.ts)은 컴포넌트만 re-export (타입 re-export 금지, 도메인 타입은 예외)
- 복합 컴포넌트: `Object.assign` 패턴 — 서브 함수/타입에 부모 prefix 필수
- `"use client"`: hooks/browser API/이벤트 핸들러 직접 사용 시에만
- 무거운 클라이언트 컴포넌트는 `next/dynamic`으로 지연 로딩
