import { BookOpen } from "lucide-react";
import Link from "next/link";

import { cn } from "@/shared/utils/cn";

import { ThemeToggle } from "./ThemeToggle";

type HeaderProps = {
	className?: string;
};

export function Header({ className }: HeaderProps) {
	return (
		<header
			className={cn(
				"border-border/50 bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-xl backdrop-saturate-150",
				className
			)}
		>
			<div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
				<Link href="/" aria-current="page" className="flex items-center gap-2.5">
					<div className="bg-primary flex size-8 items-center justify-center rounded-lg">
						<BookOpen aria-hidden="true" className="text-primary-foreground size-4" />
					</div>
					<span className="text-foreground text-lg font-bold tracking-tight">readboard</span>
				</Link>
				<ThemeToggle />
			</div>
		</header>
	);
}
