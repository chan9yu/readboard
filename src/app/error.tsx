"use client";

import { useEffect } from "react";

import { Container } from "@/shared/layouts/Container";

type ErrorProps = {
	error: Error & { digest?: string };
	reset: () => void;
};

// Notion API 오류 시 에러 UI 표시
export default function Error({ error, reset }: ErrorProps) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<Container>
			<section className="py-10">
				<div className="border-destructive bg-destructive/10 rounded-lg border p-4">
					<p className="font-semibold">데이터를 불러오는 데 실패했습니다.</p>
					<p className="text-muted-foreground text-sm">{error.message || "Notion API 호출 중 오류가 발생했습니다."}</p>
					<button onClick={reset} className="mt-3 text-sm underline underline-offset-4">
						다시 시도
					</button>
				</div>
			</section>
		</Container>
	);
}
