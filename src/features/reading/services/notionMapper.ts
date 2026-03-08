import type { PageObjectResponse } from "@notionhq/client";

import { logger } from "@/shared/utils/logger";

import type { ReadingStatus } from "../types";

type Property = PageObjectResponse["properties"][string];

const VALID_STATUSES: readonly string[] = ["읽는중", "완독", "읽을예정"];

function isReadingStatus(value: string | null): value is ReadingStatus {
	return value !== null && VALID_STATUSES.includes(value);
}

function getTitle(prop: Property | undefined) {
	if (prop?.type === "title") {
		return prop.title.map((t) => t.plain_text).join("");
	}
	return "";
}

function getRichText(prop: Property | undefined) {
	if (prop?.type === "rich_text" && prop.rich_text.length > 0) {
		return prop.rich_text.map((t) => t.plain_text).join("");
	}
	return null;
}

function getSelect(prop: Property | undefined) {
	if (prop?.type === "select") {
		return prop.select?.name ?? null;
	}
	return null;
}

function getNumber(prop: Property | undefined) {
	if (prop?.type === "number") {
		return prop.number;
	}
	return null;
}

function getUrl(prop: Property | undefined) {
	if (prop?.type === "url") {
		return prop.url;
	}
	return null;
}

function getMultiSelect(prop: Property | undefined) {
	if (prop?.type === "multi_select") {
		return prop.multi_select.map((s) => s.name);
	}
	return [];
}

function getDate(prop: Property | undefined) {
	if (prop?.type === "date") {
		return prop.date?.start ?? null;
	}
	return null;
}

export function mapPageToReadingItem(page: PageObjectResponse) {
	const props = page.properties;
	const rawStatus = getSelect(props["상태"]);

	if (!isReadingStatus(rawStatus)) {
		logger.warn("알 수 없는 독서 상태", { rawStatus, pageId: page.id });
	}

	const status: ReadingStatus = isReadingStatus(rawStatus) ? rawStatus : "읽을예정";

	return {
		id: page.id,
		title: getTitle(props["제목"]),
		author: getRichText(props["저자"]),
		status,
		rating: getNumber(props["평점"]),
		memo: getRichText(props["메모"]),
		coverImageUrl: getUrl(props["표지 이미지"]),
		categories: getMultiSelect(props["카테고리"]),
		registeredAt: getDate(props["등록일"])
	};
}
