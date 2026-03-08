import { Skeleton } from "@/shared/ui/Skeleton";

import { ReadingCardSkeleton } from "./ReadingCardSkeleton";

export function ReadingBoardSkeleton() {
	return (
		<>
			<p role="status" className="sr-only">
				독서 기록을 불러오는 중입니다.
			</p>
			<section aria-hidden="true" className="pt-12 pb-8 sm:pt-16">
				<Skeleton className="h-4 w-20 rounded" />
				<Skeleton className="mt-3 h-12 w-48 rounded-lg" />
				<div className="mt-4 flex gap-2">
					<Skeleton className="h-7 w-20 rounded-full" />
					<Skeleton className="h-7 w-20 rounded-full" />
					<Skeleton className="h-7 w-24 rounded-full" />
				</div>
				<Skeleton className="mt-3 h-5 w-72 rounded" />
			</section>
			<div aria-hidden="true" className="bg-muted flex gap-1 rounded-xl p-1">
				{Array.from({ length: 4 }).map((_, i) => (
					<Skeleton key={i} className="h-9 w-20 rounded-lg" />
				))}
			</div>
			<div aria-hidden="true" className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{Array.from({ length: 12 }).map((_, i) => (
					<ReadingCardSkeleton key={i} />
				))}
			</div>
		</>
	);
}
