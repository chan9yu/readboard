import type { ComponentProps } from "react";

import { cn } from "@/shared/utils/cn";

type SkeletonProps = ComponentProps<"div">;

export function Skeleton({ className, ...rest }: SkeletonProps) {
	return (
		<div
			data-slot="skeleton"
			className={cn(
				"from-accent via-muted to-accent rounded-md bg-linear-to-r bg-size-[400%_100%] motion-safe:animate-[shimmer_2s_ease-in-out_infinite]",
				className
			)}
			{...rest}
		/>
	);
}
