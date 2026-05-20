import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useConsent } from "../hooks/useAuth";

export function ConsentModal() {
	const { mutate, isPending } = useConsent();

	return (
		<Dialog open onOpenChange={() => {}}>
			<DialogContent className="max-w-md bg-bg-1 border border-border rounded-xl [&>button]:hidden shadow-panel">
				<DialogHeader>
					<DialogTitle className="text-md text-text-hi">
						Precisamos da sua confirmação
					</DialogTitle>
				</DialogHeader>

				<div className="flex flex-col gap-4 text-[14.5px] text-text-md leading-relaxed">
					<p>
						Atualizamos nossa{" "}
						<Link
							to="/privacy"
							target="_blank"
							className="text-accent-bright no-underline hover:underline"
						>
							Política de Privacidade
						</Link>{" "}
						e nossos{" "}
						<Link
							to="/terms"
							target="_blank"
							className="text-accent-bright no-underline hover:underline"
						>
							Termos de Uso
						</Link>
						. Para continuar usando o Detonado, confirme que você leu e concorda
						com esses documentos.
					</p>
					<p className="text-xs text-text-lo">
						Seus dados são armazenados com segurança e nunca serão
						compartilhados para fins de marketing. Você pode excluir sua conta a
						qualquer momento.
					</p>
				</div>

				<div className="flex justify-end mt-2">
					<Button
						variant="accent"
						disabled={isPending}
						onClick={() => mutate()}
						className="h-9 rounded-lg"
					>
						{isPending ? "Salvando..." : "Aceitar e continuar"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
