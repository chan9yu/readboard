import { BookOpen } from "lucide-react";

import type { StatusFilter } from "../types";

type EmptyStateProps = {
	filter: StatusFilter;
};

export function EmptyState({ filter }: EmptyStateProps) {
	const message = filter === "all" ? "아직 등록된 항목이 없습니다." : "이 상태의 항목이 없습니다.";

	return (
		<div className="text-muted-foreground flex flex-col items-center gap-3 py-16 text-center">
			<BookOpen className="size-12" />
			<p>{message}</p>
		</div>
	);
}
