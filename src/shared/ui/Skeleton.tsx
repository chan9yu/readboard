import type { ComponentProps } from "react";

import { cn } from "@/shared/utils/cn";

type SkeletonProps = ComponentProps<"div">;

export function Skeleton({ className, ...rest }: SkeletonProps) {
	return <div data-slot="skeleton" className={cn("bg-accent animate-pulse rounded-md", className)} {...rest} />;
}
