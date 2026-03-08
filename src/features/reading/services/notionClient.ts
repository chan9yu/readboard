import { Client, isFullPage } from "@notionhq/client";
import { cacheLife } from "next/cache";

import { logger } from "@/shared/utils/logger";

import { mapPageToReadingItem } from "./notionMapper";

function getEnvOrThrow(key: string) {
	const value = process.env[key];
	if (!value) {
		throw new Error(`${key} 환경 변수가 설정되지 않았습니다.`);
	}

	return value;
}

export async function fetchReadingList() {
	"use cache";
	cacheLife("hours");

	const apiKey = getEnvOrThrow("NOTION_API_KEY");
	const databaseId = getEnvOrThrow("NOTION_DATABASE_ID");
	const notion = new Client({ auth: apiKey });

	try {
		const response = await notion.dataSources.query({
			data_source_id: databaseId,
			sorts: [{ property: "등록일", direction: "descending" }],
			page_size: 100
		});

		const items = response.results.filter(isFullPage).map(mapPageToReadingItem);

		logger.info("Notion API 조회 성공", { itemCount: items.length });

		return {
			items,
			fetchedAt: new Date().toISOString()
		};
	} catch (error) {
		logger.error("Notion API 조회 실패", {
			error: error instanceof Error ? error.message : String(error)
		});
		throw error;
	}
}
