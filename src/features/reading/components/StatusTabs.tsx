"use client";

import { useRef } from "react";

import { cn } from "@/shared/utils/cn";

import type { StatusFilter } from "../types";

const TAB_ITEMS: { filter: StatusFilter; label: string }[] = [
	{ filter: "all", label: "전체" },
	{ filter: "reading", label: "읽는중" },
	{ filter: "done", label: "완독" },
	{ filter: "planned", label: "읽을예정" }
];

type StatusTabsProps = {
	currentFilter: StatusFilter;
	counts: Record<StatusFilter, number>;
	tabPanelId: string;
	onFilterChange: (filter: StatusFilter) => void;
};

export function StatusTabs({ currentFilter, counts, tabPanelId, onFilterChange }: StatusTabsProps) {
	const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

	function handleKeyDown(e: React.KeyboardEvent, index: number) {
		const count = TAB_ITEMS.length;
		let nextIndex: number | null = null;

		if (e.key === "ArrowRight") {
			nextIndex = (index + 1) % count;
		} else if (e.key === "ArrowLeft") {
			nextIndex = (index - 1 + count) % count;
		} else if (e.key === "Home") {
			nextIndex = 0;
		} else if (e.key === "End") {
			nextIndex = count - 1;
		}

		if (nextIndex !== null) {
			e.preventDefault();
			tabRefs.current[nextIndex]?.focus();
			onFilterChange(TAB_ITEMS[nextIndex]?.filter ?? "all");
		}
	}

	return (
		<div role="tablist" aria-label="독서 상태 필터" className="bg-muted flex gap-1 overflow-x-auto rounded-xl p-1">
			{TAB_ITEMS.map(({ filter, label }, index) => {
				const isActive = currentFilter === filter;

				function handleClick() {
					onFilterChange(filter);
				}

				return (
					<button
						key={filter}
						ref={(el) => {
							tabRefs.current[index] = el;
						}}
						role="tab"
						type="button"
						aria-selected={isActive}
						aria-controls={tabPanelId}
						tabIndex={isActive ? 0 : -1}
						onClick={handleClick}
						onKeyDown={(e) => handleKeyDown(e, index)}
						className={cn(
							"shrink-0 cursor-pointer rounded-lg px-4 py-2 text-sm font-medium transition-all",
							isActive ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
						)}
					>
						{label} ({counts[filter]})
					</button>
				);
			})}
		</div>
	);
}
