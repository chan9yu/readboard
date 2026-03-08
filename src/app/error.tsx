"use client";

import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

import { Container } from "@/shared/layouts/Container";

type ErrorProps = {
	error: Error & { digest?: string };
	reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<Container>
			<section aria-label="오류 발생" className="py-10">
				<div className="flex flex-col items-center gap-4 py-10 text-center">
					<div className="bg-destructive/10 flex size-20 items-center justify-center rounded-full">
						<AlertCircle aria-hidden="true" className="text-destructive size-10" />
					</div>
					<div role="alert" className="space-y-1">
						<h1 className="text-foreground font-semibold">데이터를 불러오는 데 실패했습니다</h1>
						<p className="text-muted-foreground text-sm">
							Notion API 호출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
						</p>
					</div>
					<button
						type="button"
						onClick={reset}
						className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring focus-visible:ring-offset-background mt-2 cursor-pointer rounded-full px-6 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
					>
						다시 시도
					</button>
				</div>
			</section>
		</Container>
	);
}
