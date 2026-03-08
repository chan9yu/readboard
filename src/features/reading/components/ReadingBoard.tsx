"use client";

import { useRouter, useSearchParams } from "next/navigation";

import type { ReadingItem, StatusFilter } from "../types";
import { computeStatusCounts, filterItems, isValidStatusFilter } from "../utils/statusFilter";
import { EmptyState } from "./EmptyState";
import { ReadingCard } from "./ReadingCard";
import { StatusTabs } from "./StatusTabs";

const TAB_PANEL_ID = "reading-board-panel";

const FILTER_LABELS: Record<StatusFilter, string> = {
	all: "전체",
	reading: "읽는중",
	done: "완독",
	planned: "읽을예정"
};

type ReadingBoardProps = {
	items: ReadingItem[];
};

export function ReadingBoard({ items }: ReadingBoardProps) {
	const searchParams = useSearchParams();
	const router = useRouter();

	const statusParam = searchParams.get("status");
	const currentFilter: StatusFilter = isValidStatusFilter(statusParam) ? statusParam : "all";

	const counts = computeStatusCounts(items);
	const filteredItems = filterItems(items, currentFilter);

	const handleFilterChange = (filter: StatusFilter) => {
		const params = new URLSearchParams(searchParams.toString());
		if (filter === "all") {
			params.delete("status");
		} else {
			params.set("status", filter);
		}
		const query = params.toString();
		router.replace(query ? `?${query}` : "/", { scroll: false });
	};

	return (
		<section aria-label="독서 기록 목록" className="pb-16">
			<div aria-live="polite" aria-atomic="true" className="sr-only">
				{filteredItems.length > 0
					? `${FILTER_LABELS[currentFilter]} 항목 ${filteredItems.length}권 표시 중`
					: `${FILTER_LABELS[currentFilter]} 항목이 없습니다`}
			</div>

			<StatusTabs currentFilter={currentFilter} counts={counts} onFilterChange={handleFilterChange} />

			<div id={TAB_PANEL_ID} role="tabpanel" aria-labelledby={`tab-${currentFilter}`}>
				{filteredItems.length > 0 ? (
					<div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{filteredItems.map((item) => (
							<ReadingCard key={item.id} item={item} />
						))}
					</div>
				) : (
					<EmptyState filter={currentFilter} />
				)}
			</div>
		</section>
	);
}
