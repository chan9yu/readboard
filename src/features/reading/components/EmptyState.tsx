// 빈 상태 메시지
// 선택한 상태에 해당 항목이 없을 때 표시
// TODO: 구현 예정

export function EmptyState() {
	return (
		<div className="text-muted-foreground flex flex-col items-center gap-2 py-16 text-center">
			<p>아직 등록된 항목이 없습니다.</p>
		</div>
	);
}
