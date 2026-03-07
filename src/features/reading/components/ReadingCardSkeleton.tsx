import { Skeleton } from "@/shared/ui/Skeleton";

export function ReadingCardSkeleton() {
	return (
		<div
			aria-hidden="true"
			className="bg-card border-border/60 flex flex-col overflow-hidden rounded-2xl border shadow-sm"
		>
			<Skeleton className="aspect-3/4 w-full rounded-none" />

			<div className="flex flex-col gap-2 p-4">
				<div className="flex items-start justify-between gap-2">
					<div className="flex flex-1 flex-col gap-1">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-2/3" />
					</div>
					<Skeleton className="h-5 w-12 shrink-0 rounded-full" />
				</div>

				<Skeleton className="h-3 w-1/2" />

				<div className="flex gap-0.5">
					{Array.from({ length: 5 }).map((_, i) => (
						<Skeleton key={i} className="size-3 rounded-full" />
					))}
				</div>

				<div className="mt-auto flex gap-1 pt-1">
					<Skeleton className="h-5 w-10 rounded-full" />
					<Skeleton className="h-5 w-14 rounded-full" />
				</div>
			</div>
		</div>
	);
}
