# Next.js Starter Kit

Next.js 16 기반의 웹 애플리케이션 스타터킷입니다. 프로덕션 수준의 설정과 컴포넌트가 포함되어 있어 빠르게 프로젝트를 시작할 수 있습니다.

## 기술 스택

| 분류            | 기술                                     |
| --------------- | ---------------------------------------- |
| Framework       | Next.js 16 (App Router), React 19        |
| Language        | TypeScript 5.9 (strict mode)             |
| Styling         | Tailwind CSS 4, class-variance-authority |
| Package Manager | pnpm 10                                  |
| Runtime         | Node.js 22+                              |

## 주요 기능

- **레이아웃** -- Header, Footer, Container 기반의 앱 쉘 구조
- **다크모드** -- 시스템 설정 감지, 수동 토글, FOUC 방지 처리 내장
- **UI 컴포넌트** -- Button, Dialog, Card, Sheet, DropdownMenu 등 재사용 가능한 컴포넌트
- **폼** -- react-hook-form + zod 기반 유효성 검증
- **폰트** -- Pretendard(한글), Geist Mono(코드) 로컬 폰트 내장
- **코드 품질** -- ESLint, Prettier, Lefthook pre-commit 자동화

## 시작하기

```bash
pnpm install
pnpm dev
```

개발 서버는 `http://localhost:3100`에서 실행됩니다.

## 명령어

```bash
pnpm dev          # 개발 서버
pnpm build        # 프로덕션 빌드
pnpm lint         # ESLint 검사
pnpm lint:fix     # ESLint 자동 수정
pnpm format       # Prettier 포맷팅
pnpm format:check # Prettier 포맷 검사
pnpm type:check   # TypeScript 타입 검사
```

## 프로젝트 구조

```
src/
├── app/          # 라우팅 (thin layer)
├── features/     # 기능별 모듈 (components, types, services)
└── shared/
    ├── ui/       # 재사용 UI 컴포넌트
    ├── layouts/  # 앱 쉘 (Header, Footer, Container)
    ├── hooks/    # 공용 훅
    ├── utils/    # 유틸리티
    ├── styles/   # 전역 CSS, 디자인 토큰
    └── fonts/    # 로컬 폰트 파일
```

## 라이선스

MIT
