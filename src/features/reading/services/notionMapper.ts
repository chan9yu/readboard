// Notion PageObjectResponse → ReadingItem 변환 로직
// @notionhq/client 설치 후 구현 예정

// 매핑 규칙:
// properties['제목'].title[0].plain_text
// properties['저자'].rich_text[0]?.plain_text ?? null
// properties['상태'].select?.name as ReadingStatus
// properties['평점'].number ?? null
// properties['표지 이미지'].url ?? null
// properties['카테고리'].multi_select.map(s => s.name)
// properties['등록일'].date?.start ?? null
