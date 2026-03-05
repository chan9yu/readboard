// Server 전용 — "use client" 선언 금지
// Notion API 호출 및 캐싱 로직
// @notionhq/client 설치 후 구현 예정 (pnpm add @notionhq/client)

import type { ReadingListData } from "../types";

export async function fetchReadingList(): Promise<ReadingListData> {
	"use cache";

	// TODO: @notionhq/client 설치 후 구현
	// const { Client } = await import("@notionhq/client");
	// const notion = new Client({ auth: process.env.NOTION_API_KEY });
	// const response = await notion.databases.query({
	//   database_id: process.env.NOTION_DATABASE_ID!,
	//   sorts: [{ property: "등록일", direction: "descending" }],
	//   page_size: 100,
	// });
	// return { items: response.results.map(mapPageToReadingItem), fetchedAt: new Date().toISOString() };

	return {
		items: [],
		fetchedAt: new Date().toISOString()
	};
}
