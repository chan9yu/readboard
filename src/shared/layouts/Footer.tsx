import { cn } from "@/shared/utils";

type FooterProps = {
	className?: string;
};

export function Footer({ className }: FooterProps) {
	return (
		<footer className={cn("border-border bg-background border-t", className)}>
			<div className="mx-auto flex h-16 max-w-5xl items-center justify-center px-4 sm:px-6">
				<p className="text-foreground/50 text-sm">&copy; 2026 readboard. All rights reserved.</p>
			</div>
		</footer>
	);
}
