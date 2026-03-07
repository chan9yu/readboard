import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

import type { ReadingStatus } from "../types";

type Property = PageObjectResponse["properties"][string];

const VALID_STATUSES: ReadingStatus[] = ["읽는중", "완독", "읽을예정"];

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
	const status: ReadingStatus = VALID_STATUSES.includes(rawStatus as ReadingStatus)
		? (rawStatus as ReadingStatus)
		: "읽을예정";

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
