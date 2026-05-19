import { createFileRoute } from "@tanstack/react-router";
import { AccountDeleteSection } from "@/features/auth/components/AccountDeleteSection";
import { AccountEditSection } from "@/features/auth/components/AccountEditSection";
import { AccountExportSection } from "@/features/auth/components/AccountExportSection";
import { usePageTitle } from "@/shared/hooks/usePageTitle";

export const Route = createFileRoute("/account")({
	component: AccountPage,
});

function AccountPage() {
	usePageTitle("Configurações da Conta");

	return (
		<div className="max-w-xl mx-auto px-6 py-12 flex flex-col gap-10">
			<div>
				<p className="font-mono text-[11.5px] tracking-widest uppercase text-accent-bright mb-2">
					Conta
				</p>
				<h1 className="text-2xl font-semibold tracking-tight text-text-hi">
					Configurações
				</h1>
			</div>

			<AccountEditSection />

			<div className="border-t border-border-soft" />

			<AccountExportSection />

			<div className="border-t border-border-soft" />

			<AccountDeleteSection />

			<div className="pt-2 border-t border-border-soft flex gap-4 text-[12.5px] text-text-lo">
				<a
					href="/privacy"
					className="text-accent-bright no-underline hover:underline"
				>
					Política de Privacidade
				</a>
				<a
					href="/terms"
					className="text-accent-bright no-underline hover:underline"
				>
					Termos de Uso
				</a>
			</div>
		</div>
	);
}
