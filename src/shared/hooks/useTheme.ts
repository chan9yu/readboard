"use client";

import { useTheme as useNextTheme } from "next-themes";
import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function useTheme() {
	const { theme, setTheme: setNextTheme, resolvedTheme } = useNextTheme();
	const mounted = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);

	function setTheme(newTheme: Theme) {
		if (!document.startViewTransition) {
			setNextTheme(newTheme);
			return;
		}

		document.startViewTransition(() => {
			setNextTheme(newTheme);
		});
	}

	return {
		theme: (theme ?? "system") as Theme,
		resolvedTheme: (resolvedTheme ?? "light") as ResolvedTheme,
		setTheme,
		mounted
	};
}
