"use client";

import { X } from "lucide-react";
import type { FormEvent, MouseEvent, PropsWithChildren } from "react";
import { createContext, use, useEffect, useId, useRef, useState } from "react";

import { cn } from "@/shared/utils";
import { Button } from "./Button";

type DialogContextValue = {
	titleId: string;
};

const DialogContext = createContext<DialogContextValue | null>(null);

type DialogProps = PropsWithChildren<{
	open: boolean;
	onClose: () => void;
	className?: string;
}>;

function DialogRoot({ open, onClose, className, children }: DialogProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const [visible, setVisible] = useState(false);
	const titleId = useId();

	if (open && !visible) {
		setVisible(true);
	}

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (open && !dialog.open) {
			dialog.showModal();
		}
	}, [open]);

	const handleAnimationEnd = () => {
		if (!open) {
			dialogRef.current?.close();
			setVisible(false);
		}
	};

	const handleCancel = (e: FormEvent<HTMLDialogElement>) => {
		e.preventDefault();
		onClose();
	};

	const handleBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
		if (e.target === e.currentTarget) onClose();
	};

	if (!visible) return null;

	return (
		<DialogContext value={{ titleId }}>
			<dialog
				ref={dialogRef}
				aria-labelledby={titleId}
				onCancel={handleCancel}
				onClick={handleBackdropClick}
				onAnimationEnd={handleAnimationEnd}
				className={cn(
					"border-border bg-background text-foreground m-auto w-full max-w-lg rounded-xl border p-0 shadow-lg",
					!open && "closing",
					className
				)}
			>
				<div className="relative p-6">
					<Button
						variant="ghost"
						size="icon"
						onClick={onClose}
						className="absolute top-4 right-4 h-7 w-7 opacity-70 hover:opacity-100"
						aria-label="닫기"
					>
						<X size={16} aria-hidden="true" />
					</Button>
					{children}
				</div>
			</dialog>
		</DialogContext>
	);
}

type DialogSectionProps = PropsWithChildren<{ className?: string }>;

function DialogHeader({ className, children }: DialogSectionProps) {
	return <div className={cn("flex flex-col gap-1.5 pr-8", className)}>{children}</div>;
}

function DialogTitle({ className, children }: DialogSectionProps) {
	const { titleId } = use(DialogContext)!;
	return (
		<h2 id={titleId} className={cn("text-lg leading-none font-semibold tracking-tight", className)}>
			{children}
		</h2>
	);
}

function DialogDescription({ className, children }: DialogSectionProps) {
	return <p className={cn("text-muted-foreground text-sm", className)}>{children}</p>;
}

function DialogFooter({ className, children }: DialogSectionProps) {
	return <div className={cn("mt-6 flex justify-end gap-2", className)}>{children}</div>;
}

export const Dialog = Object.assign(DialogRoot, {
	Header: DialogHeader,
	Title: DialogTitle,
	Description: DialogDescription,
	Footer: DialogFooter
});
