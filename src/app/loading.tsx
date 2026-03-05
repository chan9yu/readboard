import { ReadingCardSkeleton } from "@/features/reading";
import { Container } from "@/shared/layouts";

// F003 — 로딩 스켈레톤: 카드 형태 12개 그리드
export default function Loading() {
	return (
		<Container>
			<section className="py-10">
				<div className="bg-muted h-9 w-32 animate-pulse rounded" />
			</section>

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{Array.from({ length: 12 }).map((_, i) => (
					<ReadingCardSkeleton key={i} />
				))}
			</div>
		</Container>
	);
}
