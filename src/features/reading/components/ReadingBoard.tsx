"use client";

// 탭 + 카드 그리드 컨테이너
// useSearchParams()로 URL 쿼리 파라미터 읽기/쓰기, 필터 상태 관리
// TODO: 구현 예정

import type { ReadingItem } from "../types";

export type ReadingBoardProps = {
	items: ReadingItem[];
};

export function ReadingBoard({ items }: ReadingBoardProps) {
	if (items.length === 0) {
		return null;
	}

	return <div />;
}
