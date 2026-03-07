import { BookOpen } from "lucide-react";

import type { StatusFilter } from "../types";

type EmptyStateProps = {
	filter: StatusFilter;
};

export function EmptyState({ filter }: EmptyStateProps) {
	const isAll = filter === "all";
	const title = isAll ? "아직 등록된 항목이 없습니다" : "이 상태의 항목이 없습니다";
	const description = isAll ? "노션 데이터베이스에 독서 기록을 추가해 보세요." : "다른 탭을 확인해 보세요.";

	return (
		<div className="flex flex-col items-center gap-4 py-20 text-center">
			<div className="bg-muted flex size-20 items-center justify-center rounded-full">
				<BookOpen aria-hidden="true" className="text-muted-foreground size-10" />
			</div>
			<div className="space-y-1">
				<p className="text-foreground font-medium">{title}</p>
				<p className="text-muted-foreground text-sm">{description}</p>
			</div>
		</div>
	);
}
