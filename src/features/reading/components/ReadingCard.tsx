import { BookOpen, Star } from "lucide-react";

import { Badge } from "@/shared/ui/Badge";
import { cn } from "@/shared/utils/cn";

import type { ReadingItem, ReadingStatus } from "../types";

type ReadingCardProps = {
	item: ReadingItem;
};

const STATUS_VARIANT: Record<ReadingStatus, "default" | "secondary" | "outline"> = {
	읽는중: "default",
	완독: "secondary",
	읽을예정: "outline"
};

export function ReadingCard({ item }: ReadingCardProps) {
	return (
		<div className="bg-card text-card-foreground flex flex-col overflow-hidden rounded-xl border shadow-sm">
			<div className="bg-muted relative aspect-3/4 w-full overflow-hidden">
				{item.coverImageUrl ? (
					<img src={item.coverImageUrl} alt={`${item.title} 표지`} className="h-full w-full object-cover" />
				) : (
					<div className="flex h-full w-full items-center justify-center">
						<BookOpen className="text-muted-foreground size-12" />
					</div>
				)}
			</div>

			<div className="flex flex-1 flex-col gap-2 p-4">
				<div className="flex items-start justify-between gap-2">
					<h3 className="line-clamp-2 text-sm leading-snug font-semibold">{item.title}</h3>
					<Badge variant={STATUS_VARIANT[item.status]} className="shrink-0 text-[10px]">
						{item.status}
					</Badge>
				</div>

				{item.author && <p className="text-muted-foreground line-clamp-1 text-xs">{item.author}</p>}

				{item.rating != null && <StarRating rating={item.rating} />}

				{item.categories.length > 0 && (
					<div className="mt-auto flex flex-wrap gap-1 pt-1">
						{item.categories.map((category) => (
							<Badge key={category} variant="secondary" className="text-[10px]">
								{category}
							</Badge>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

type StarRatingProps = {
	rating: number;
};

function StarRating({ rating }: StarRatingProps) {
	return (
		<div className="flex gap-0.5">
			{Array.from({ length: 5 }).map((_, i) => (
				<Star
					key={i}
					className={cn("size-3", i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30")}
				/>
			))}
		</div>
	);
}
