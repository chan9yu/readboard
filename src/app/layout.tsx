import "@/shared/styles/globals.css";

import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import type { PropsWithChildren } from "react";

import { Footer } from "@/shared/layouts/Footer";
import { Header } from "@/shared/layouts/Header";

const pretendard = localFont({
	src: "../shared/fonts/PretendardVariable.woff2",
	variable: "--font-pretendard",
	display: "swap",
	weight: "100 900"
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"]
});

export const metadata: Metadata = {
	title: "readboard — 독서 기록 보드",
	description: "노션 데이터베이스의 독서 기록을 보기 좋게 공유하는 서비스"
};

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="ko" suppressHydrationWarning>
			<body className={`${pretendard.variable} ${geistMono.variable} font-sans antialiased`}>
				<ThemeProvider attribute="class" defaultTheme="system" enableColorScheme={false}>
					<div className="flex min-h-dvh flex-col">
						<Header />
						<main className="flex-1">{children}</main>
						<Footer />
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
