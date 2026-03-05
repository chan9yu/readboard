import Link from "next/link";

import { cn } from "@/shared/utils";

type HeaderProps = {
	className?: string;
};

export function Header({ className }: HeaderProps) {
	return (
		<header
			className={cn("border-border bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-sm", className)}
		>
			<div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
				<Link href="/" className="text-foreground text-lg font-bold tracking-tight">
					readboard
				</Link>
			</div>
		</header>
	);
}
