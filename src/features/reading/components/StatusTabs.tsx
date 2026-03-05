"use client";

// 상태 필터 탭 (전체 / 읽는중 / 완독 / 읽을예정)
// 탭 클릭 → URL 쿼리 파라미터(?status=reading) 업데이트
// TODO: 구현 예정

import type { StatusFilter } from "../types";

export type StatusTabsProps = {
	currentFilter: StatusFilter;
	onFilterChange: (filter: StatusFilter) => void;
};

export function StatusTabs({ currentFilter, onFilterChange }: StatusTabsProps) {
	return <div data-filter={currentFilter} onClick={() => onFilterChange("all")} />;
}
