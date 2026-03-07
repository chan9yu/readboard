import { Star } from "lucide-react";

import { cn } from "@/shared/utils/cn";

type StarRatingProps = {
	rating: number;
};

export function StarRating({ rating }: StarRatingProps) {
	return (
		<div className="flex gap-0.5" role="img" aria-label={`평점 5점 중 ${rating}점`}>
			{Array.from({ length: 5 }).map((_, i) => (
				<Star
					key={i}
					aria-hidden="true"
					className={cn("size-3", i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30")}
				/>
			))}
		</div>
	);
}
