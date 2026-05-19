import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmRemoveModalProps {
	gameName: string;
	onConfirm: () => void;
	onCancel: () => void;
	isPending: boolean;
}

export function ConfirmRemoveModal({
	gameName,
	onConfirm,
	onCancel,
	isPending,
}: ConfirmRemoveModalProps) {
	return (
		<AlertDialog
			open
			onOpenChange={(open) => {
				if (!open) onCancel();
			}}
		>
			<AlertDialogContent className="max-w-sm text-center bg-bg-1 border border-border rounded-xl shadow-panel">
				<div className="flex flex-col items-center gap-3">
					<div className="size-12 flex items-center justify-center rounded-full text-[23px] bg-[oklch(0.3_0.1_25/0.3)] text-error">
						⚠
					</div>
					<AlertDialogHeader className="space-y-0">
						<AlertDialogTitle className="text-[19px] text-text-hi">
							Remover jogo?
						</AlertDialogTitle>
						<AlertDialogDescription className="text-text-md text-[14.5px] leading-relaxed max-w-[34ch]">
							<strong className="text-text-hi">{gameName}</strong> será removido
							permanentemente da sua biblioteca.
						</AlertDialogDescription>
					</AlertDialogHeader>
				</div>

				<AlertDialogFooter className="flex-row justify-center gap-2.5 sm:justify-center">
					<AlertDialogCancel
						onClick={onCancel}
						className="h-9 border border-border text-text-md rounded-[8px]"
					>
						Cancelar
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						disabled={isPending}
						className="h-9 rounded-[8px] bg-error text-white hover:bg-error/90"
					>
						{isPending ? "Removendo..." : "Remover"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
