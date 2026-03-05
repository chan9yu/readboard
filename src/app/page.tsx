import { Suspense } from "react";

import { ReadingBoard } from "@/features/reading";
import { fetchReadingList } from "@/features/reading/services/notionClient";
import { Container } from "@/shared/layouts";

// TODO: 통계 요약 컴포넌트 구현 후 교체
async function ReadingBoardSection() {
	const data = await fetchReadingList();

	return <ReadingBoard items={data.items} />;
}

export default function HomePage() {
	return (
		<Container>
			<section className="py-10">
				<h1 className="text-foreground text-3xl font-bold tracking-tight">독서 기록</h1>
				{/* TODO: 통계 요약 (N권 완독 · N권 읽는중) */}
			</section>

			<Suspense fallback={<div className="bg-muted h-96 w-full animate-pulse rounded-lg" />}>
				<ReadingBoardSection />
			</Suspense>
		</Container>
	);
}
