import { ReadingBoardSkeleton } from "@/features/reading/components/ReadingBoardSkeleton";
import { Container } from "@/shared/layouts/Container";
import { Skeleton } from "@/shared/ui/Skeleton";

export default function Loading() {
	return (
		<Container>
			<ReadingBoardSkeleton />

			<div aria-hidden="true" className="bg-muted flex gap-1 rounded-xl p-1">
				{Array.from({ length: 4 }).map((_, i) => (
					<Skeleton key={i} className="h-9 w-20 rounded-lg" />
				))}
			</div>
		</Container>
	);
}
