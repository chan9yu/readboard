import { FileQuestion } from "lucide-react";
import Link from "next/link";

import { Container } from "@/shared/layouts/Container";

export default function NotFound() {
	return (
		<Container>
			<section aria-label="페이지를 찾을 수 없음" className="py-10">
				<div className="flex flex-col items-center gap-4 py-10 text-center">
					<div className="bg-muted flex size-20 items-center justify-center rounded-full">
						<FileQuestion aria-hidden="true" className="text-muted-foreground size-10" />
					</div>
					<div className="space-y-1">
						<h1 className="text-foreground font-semibold">페이지를 찾을 수 없습니다</h1>
						<p className="text-muted-foreground text-sm">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
					</div>
					<Link
						href="/"
						className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring focus-visible:ring-offset-background mt-2 inline-flex rounded-full px-6 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
					>
						홈으로 돌아가기
					</Link>
				</div>
			</section>
		</Container>
	);
}
