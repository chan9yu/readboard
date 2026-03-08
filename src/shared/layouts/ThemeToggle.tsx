"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/shared/hooks/useTheme";

export function ThemeToggle() {
	const { resolvedTheme, setTheme, mounted } = useTheme();

	if (!mounted) {
		return <div className="size-9" aria-hidden="true" />;
	}

	const isDark = resolvedTheme === "dark";

	const handleToggle = () => {
		setTheme(isDark ? "light" : "dark");
	};

	return (
		<button
			type="button"
			onClick={handleToggle}
			className="text-muted-foreground hover:text-foreground hover:bg-accent focus-visible:ring-ring focus-visible:ring-offset-background inline-flex size-9 cursor-pointer items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
			aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
		>
			{isDark ? <Sun aria-hidden="true" className="size-5" /> : <Moon aria-hidden="true" className="size-5" />}
		</button>
	);
}
