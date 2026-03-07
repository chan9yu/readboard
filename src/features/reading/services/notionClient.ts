// Server 전용 — "use client" 선언 금지

import { Client, isFullPage } from "@notionhq/client";
import { cacheLife } from "next/cache";

import type { ReadingListData } from "../types";
import { mapPageToReadingItem } from "./notionMapper";

// Task 010: 모듈 로드 시점에서 환경 변수 검증 (빌드 타임 오류로 조기 감지)
function getEnvOrThrow(key: string): string {
	const value = process.env[key];
	if (!value) {
		throw new Error(`${key} 환경 변수가 설정되지 않았습니다.`);
	}
	return value;
}

const NOTION_API_KEY = getEnvOrThrow("NOTION_API_KEY");
const NOTION_DATABASE_ID = getEnvOrThrow("NOTION_DATABASE_ID");

const notion = new Client({ auth: NOTION_API_KEY });

export async function fetchReadingList(): Promise<ReadingListData> {
	"use cache";
	cacheLife("hours");

	const response = await notion.dataSources.query({
		data_source_id: NOTION_DATABASE_ID,
		sorts: [{ property: "등록일", direction: "descending" }],
		page_size: 100
	});

	return {
		items: response.results.filter(isFullPage).map(mapPageToReadingItem),
		fetchedAt: new Date().toISOString()
	};
}
