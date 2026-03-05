// 개별 도서/아티클 카드 (순수 표현 컴포넌트)
// 표지 이미지, 제목, 저자, 상태 Badge, 평점, 카테고리 Badge 표시
// TODO: 구현 예정

import type { ReadingItem } from "../types";

export type ReadingCardProps = {
	item: ReadingItem;
};

export function ReadingCard({ item }: ReadingCardProps) {
	return <div data-id={item.id} />;
}
