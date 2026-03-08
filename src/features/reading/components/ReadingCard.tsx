import { BookOpen } from "lucide-react";

import { Badge } from "@/shared/ui/Badge";
import { cn } from "@/shared/utils/cn";

import type { ReadingItem, ReadingStatus } from "../types";
import { StarRating } from "./StarRating";

type ReadingCardProps = {
	item: ReadingItem;
};

const STATUS_STYLES: Record<ReadingStatus, string> = {
	읽는중: "border border-status-reading/25 bg-status-reading/15 text-status-reading-text",
	완독: "border border-status-done/25 bg-status-done/15 text-status-done-text",
	읽을예정: "border border-status-planned/25 bg-status-planned/15 text-status-planned-text"
};

export function ReadingCard({ item }: ReadingCardProps) {
	const titleId = `card-title-${item.id}`;

	return (
		<article
			aria-labelledby={titleId}
			className="bg-card text-card-foreground group border-border/60 hover:shadow-primary/5 flex flex-col overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-lg"
		>
			<div className="bg-muted relative aspect-3/4 w-full overflow-hidden">
				{item.coverImageUrl ? (
					<img
						src={item.coverImageUrl}
						alt={`${item.title} 표지`}
						loading="lazy"
						className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
					/>
				) : (
					<div className="from-muted to-accent/30 flex h-full w-full items-center justify-center bg-linear-to-br">
						<BookOpen aria-hidden="true" className="text-muted-foreground size-12" />
					</div>
				)}
			</div>

			<div className="flex flex-1 flex-col gap-2 p-4">
				<div className="flex items-start justify-between gap-2">
					<h3 id={titleId} className="line-clamp-2 text-sm leading-snug font-semibold">
						{item.title}
					</h3>
					<span className={cn("shrink-0 rounded-full px-2 py-0.5 text-xs font-medium", STATUS_STYLES[item.status])}>
						{item.status}
					</span>
				</div>

				{item.author && <p className="text-muted-foreground line-clamp-1 text-xs">{item.author}</p>}

				{item.rating != null && <StarRating rating={item.rating} />}

				{item.categories.length > 0 && (
					<div className="mt-auto flex flex-wrap gap-1 pt-1">
						{item.categories.map((category) => (
							<Badge key={category} variant="secondary" className="text-xs">
								{category}
							</Badge>
						))}
					</div>
				)}
			</div>
		</article>
	);
}
