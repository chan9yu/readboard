# readboard

노션 데이터베이스 기반 독서 기록 보드.
<br />
노션에 입력한 책/아티클 데이터를 웹에서 상태별로 조회할 수 있는 공개 페이지 서비스.

## 기술 스택

| 분류            | 기술                                     |
| --------------- | ---------------------------------------- |
| Framework       | Next.js 16 (App Router), React 19        |
| Language        | TypeScript 5.9 (strict mode)             |
| Styling         | Tailwind CSS 4, class-variance-authority |
| Data Source     | Notion API (`@notionhq/client`)          |
| Package Manager | pnpm 10                                  |
| Runtime         | Node.js 22+                              |

## 주요 기능

- **독서 목록 조회** -- 노션 DB에서 Server Component로 직접 데이터 패칭
- **상태별 필터링** -- 읽는중 / 완독 / 읽을예정 탭 전환 (URL 쿼리 파라미터 유지)
- **반응형 카드 그리드** -- 모바일 1열 ~ 데스크톱 4열 자동 조정
- **다크모드** -- 시스템 설정 감지, 수동 토글, FOUC 방지

## 시작하기

```bash
pnpm install
cp .env.example .env.local  # 환경 변수 설정
pnpm dev
```

개발 서버는 `http://localhost:3100`에서 실행됩니다.

## 환경 변수

```bash
NOTION_API_KEY=           # Notion Integration Secret Key
NOTION_DATABASE_ID=       # 독서 기록 Database ID
```

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
├── app/              # 라우팅 (thin layer)
├── features/
│   └── reading/      # 독서 기록 기능 모듈
│       ├── components/
│       ├── services/  # Notion API 호출
│       └── types/
└── shared/
    ├── ui/           # 재사용 UI 컴포넌트
    ├── layouts/      # 앱 쉘 (Header, Footer, Container)
    ├── hooks/
    ├── utils/
    ├── styles/       # 전역 CSS, 디자인 토큰
    └── fonts/        # 로컬 폰트 파일
```

## 라이선스

MIT
