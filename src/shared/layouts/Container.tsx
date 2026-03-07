import type { PropsWithChildren } from "react";

import { cn } from "@/shared/utils/cn";

type ContainerProps = PropsWithChildren<{ className?: string }>;

export function Container({ className, children }: ContainerProps) {
	return <div className={cn("mx-auto w-full max-w-5xl px-4 sm:px-6", className)}>{children}</div>;
}
