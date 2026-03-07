import type { ReadingItem, StatusFilter } from "../types";
import { STATUS_MAP } from "../types";

const VALID_FILTERS: StatusFilter[] = ["all", "reading", "done", "planned"];

export function isValidStatusFilter(value: string | null): value is StatusFilter {
	return value !== null && VALID_FILTERS.includes(value as StatusFilter);
}

export function computeStatusCounts(items: ReadingItem[]) {
	const counts: Record<StatusFilter, number> = {
		all: items.length,
		reading: 0,
		done: 0,
		planned: 0
	};

	for (const item of items) {
		const filter = STATUS_MAP[item.status];
		counts[filter]++;
	}

	return counts;
}

export function filterItems(items: ReadingItem[], filter: StatusFilter) {
	return filter === "all" ? items : items.filter((item) => STATUS_MAP[item.status] === filter);
}
