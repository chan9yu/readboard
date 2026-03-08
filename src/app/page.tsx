import { Suspense } from "react";

import { ReadingBoard } from "@/features/reading/components/ReadingBoard";
import { ReadingBoardSkeleton } from "@/features/reading/components/ReadingBoardSkeleton";
import { StatsSummary } from "@/features/reading/components/StatsSummary";
import { fetchReadingList } from "@/features/reading/services/notionClient";
import { Container } from "@/shared/layouts/Container";

async function ReadingBoardSection() {
	const data = await fetchReadingList();

	return (
		<>
			<section aria-labelledby="reading-log-heading" className="pt-12 pb-8 sm:pt-16">
				<p lang="en" className="text-primary text-sm font-medium tracking-wide uppercase">Reading Log</p>
				<h1 id="reading-log-heading" className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl">독서 기록</h1>
				<StatsSummary items={data.items} />
				<p className="text-muted-foreground mt-3 max-w-lg text-base">노션에 기록한 독서 목록을 한눈에 확인하세요.</p>
			</section>
			<ReadingBoard items={data.items} />
		</>
	);
}

export default function HomePage() {
	return (
		<Container>
			<Suspense fallback={<ReadingBoardSkeleton />}>
				<ReadingBoardSection />
			</Suspense>
		</Container>
	);
}
