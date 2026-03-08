import { ReadingBoardSkeleton } from "@/features/reading/components/ReadingBoardSkeleton";
import { Container } from "@/shared/layouts/Container";

export default function Loading() {
	return (
		<Container>
			<ReadingBoardSkeleton />
		</Container>
	);
}
