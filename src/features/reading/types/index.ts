export type ReadingStatus = "읽는중" | "완독" | "읽을예정";

export type StatusFilter = "all" | "reading" | "done" | "planned";

export const STATUS_MAP: Record<ReadingStatus, StatusFilter> = {
	읽는중: "reading",
	완독: "done",
	읽을예정: "planned"
};

export type ReadingItem = {
	id: string;
	title: string;
	author: string | null;
	status: ReadingStatus;
	rating: number | null; // 1~5, null이면 미표시
	memo: string | null;
	coverImageUrl: string | null;
	categories: string[];
	registeredAt: string | null; // ISO 8601 날짜 문자열
};

export type ReadingListData = {
	items: ReadingItem[];
	fetchedAt: string; // 캐시 시각 (디버깅용)
};
