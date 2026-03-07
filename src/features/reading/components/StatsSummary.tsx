import type { ReadingItem } from "../types";

type StatsSummaryProps = {
	items: ReadingItem[];
};

export function StatsSummary({ items }: StatsSummaryProps) {
	const doneCount = items.filter((item) => item.status === "완독").length;
	const readingCount = items.filter((item) => item.status === "읽는중").length;

	return (
		<div className="mt-4 flex flex-wrap gap-2">
			<span className="bg-secondary text-secondary-foreground inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium">
				<span aria-hidden="true" className="bg-foreground/50 size-2 rounded-full" />
				{items.length}권 전체
			</span>
			<span className="bg-status-done/15 text-status-done inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium">
				<span aria-hidden="true" className="bg-status-done size-2 rounded-full" />
				{doneCount}권 완독
			</span>
			<span className="bg-status-reading/15 text-status-reading inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium">
				<span aria-hidden="true" className="bg-status-reading size-2 rounded-full" />
				{readingCount}권 읽는중
			</span>
		</div>
	);
}
