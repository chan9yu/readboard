import type { ReadingItem } from "../types";
import { computeStatusCounts } from "../utils/statusFilter";

type StatsSummaryProps = {
	items: ReadingItem[];
};

export function StatsSummary({ items }: StatsSummaryProps) {
	const counts = computeStatusCounts(items);

	return (
		<div role="group" aria-label="독서 통계 요약" className="mt-4 flex flex-wrap gap-2">
			<span className="bg-secondary text-secondary-foreground inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium">
				<span aria-hidden="true" className="bg-foreground/50 size-2 rounded-full" />
				{counts.all}권 전체
			</span>
			<span className="bg-status-done/15 text-status-done-text inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium">
				<span aria-hidden="true" className="bg-status-done size-2 rounded-full" />
				{counts.done}권 완독
			</span>
			<span className="bg-status-reading/15 text-status-reading-text inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium">
				<span aria-hidden="true" className="bg-status-reading size-2 rounded-full" />
				{counts.reading}권 읽는중
			</span>
		</div>
	);
}
