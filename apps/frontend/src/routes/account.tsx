import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Download, Lock, Mail, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	useDeleteAccountForm,
	useExportData,
	useUpdateAccountForm,
} from "@/features/auth/hooks/useAuth";
import { usePageTitle } from "@/shared/hooks/usePageTitle";

export const Route = createFileRoute("/account")({
	component: AccountPage,
});

function AccountPage() {
	usePageTitle("Configurações da Conta");
	const navigate = useNavigate();
	const [deleteOpen, setDeleteOpen] = useState(false);

	const exportMutation = useExportData();

	const {
		form: updateForm,
		onSubmit: onUpdateSubmit,
		mutation: updateMutation,
	} = useUpdateAccountForm(() => {
		toast.success("Conta atualizada com sucesso!");
	});

	const {
		form: deleteForm,
		onSubmit: onDeleteSubmit,
		mutation: deleteMutation,
	} = useDeleteAccountForm(() => {
		navigate({ to: "/login" });
	});

	const {
		register: regUpdate,
		formState: { errors: updateErrors },
	} = updateForm;

	const {
		register: regDelete,
		formState: { errors: deleteErrors },
	} = deleteForm;

	function handleExport() {
		exportMutation.mutate(undefined, {
			onSuccess: (data) => {
				const blob = new Blob([JSON.stringify(data, null, 2)], {
					type: "application/json",
				});
				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = "zerado-dados.json";
				a.click();
				URL.revokeObjectURL(url);
				toast.success("Dados exportados!");
			},
			onError: (err) => {
				toast.error((err as Error).message ?? "Erro ao exportar dados");
			},
		});
	}

	return (
		<div className="max-w-xl mx-auto px-6 py-12 flex flex-col gap-10">
			<div>
				<p className="font-mono text-[10.5px] tracking-widest uppercase text-accent-bright mb-2">
					Conta
				</p>
				<h1 className="text-2xl font-semibold tracking-tight text-text-hi">
					Configurações
				</h1>
			</div>

			{/* Edit account */}
			<section className="flex flex-col gap-4">
				<h2 className="text-[13px] font-semibold text-text-hi flex items-center gap-2">
					<Mail size={14} className="text-accent-bright" />
					Editar conta
				</h2>
				<p className="text-[12.5px] text-text-lo -mt-2">
					Informe a senha atual e altere o e-mail, a senha, ou ambos.
				</p>
				<form onSubmit={onUpdateSubmit} className="flex flex-col gap-3">
					<div className="flex flex-col gap-1.5">
						<Label className="mono-label">Senha atual</Label>
						<Input
							type="password"
							{...regUpdate("currentPassword")}
							placeholder="sua senha atual"
							className="bg-bg-2 border-border text-text-hi placeholder:text-text-lo h-9.5"
						/>
						{updateErrors.currentPassword && (
							<p className="text-[13px] m-0 text-error">
								{updateErrors.currentPassword.message}
							</p>
						)}
					</div>

					<div className="flex flex-col gap-1.5">
						<Label className="mono-label">
							Novo e-mail <span className="text-text-lo">(opcional)</span>
						</Label>
						<Input
							type="email"
							{...regUpdate("email")}
							placeholder="novo@email.com"
							className="bg-bg-2 border-border text-text-hi placeholder:text-text-lo h-9.5"
						/>
						{updateErrors.email && (
							<p className="text-[13px] m-0 text-error">
								{updateErrors.email.message}
							</p>
						)}
					</div>

					<div className="flex flex-col gap-1.5">
						<Label className="mono-label">
							Nova senha <span className="text-text-lo">(opcional)</span>
						</Label>
						<Input
							type="password"
							{...regUpdate("newPassword")}
							placeholder="mínimo 8 caracteres"
							className="bg-bg-2 border-border text-text-hi placeholder:text-text-lo h-9.5"
						/>
						{updateErrors.newPassword && (
							<p className="text-[13px] m-0 text-error">
								{updateErrors.newPassword.message}
							</p>
						)}
					</div>

					{updateMutation.error && (
						<p className="text-[13px] m-0 text-error">
							{updateMutation.error.message}
						</p>
					)}

					<Button
						variant="outline"
						type="submit"
						disabled={updateMutation.isPending}
						className="w-fit h-9 rounded-[8px] mt-1 text-[12.5px]"
					>
						<Lock size={12} />
						{updateMutation.isPending ? "Salvando..." : "Salvar alterações"}
					</Button>
				</form>
			</section>

			<div className="border-t border-border-soft" />

			{/* Export data */}
			<section className="flex flex-col gap-3">
				<h2 className="text-[13px] font-semibold text-text-hi flex items-center gap-2">
					<Download size={14} className="text-accent-bright" />
					Exportar meus dados
				</h2>
				<p className="text-[12.5px] text-text-lo">
					Baixe um arquivo JSON com todos os seus dados — perfil e biblioteca
					completa. Seu direito de portabilidade pela LGPD (Art. 19).
				</p>
				<Button
					variant="outline"
					onClick={handleExport}
					disabled={exportMutation.isPending}
					className="w-fit h-9 rounded-[8px] text-[12.5px]"
				>
					<Download size={12} />
					{exportMutation.isPending ? "Preparando..." : "Baixar dados (.json)"}
				</Button>
			</section>

			<div className="border-t border-border-soft" />

			{/* Delete account */}
			<section className="flex flex-col gap-3">
				<h2 className="text-[13px] font-semibold text-text-hi flex items-center gap-2">
					<Trash2 size={14} className="text-error" />
					Excluir conta
				</h2>
				<p className="text-[12.5px] text-text-lo">
					Esta ação remove permanentemente sua conta e toda a sua biblioteca.
					Não há como desfazer. Seu direito de exclusão pela LGPD (Art. 18).
				</p>

				{!deleteOpen ? (
					<Button
						variant="outline"
						onClick={() => setDeleteOpen(true)}
						className="w-fit h-9 rounded-[8px] text-[12.5px] text-error border-error/30 hover:bg-error/10"
					>
						<Trash2 size={12} />
						Excluir minha conta
					</Button>
				) : (
					<form
						onSubmit={onDeleteSubmit}
						className="flex flex-col gap-3 p-4 rounded-lg border border-error/30 bg-error/5"
					>
						<p className="text-[12.5px] text-text-md">
							Para confirmar, insira sua senha abaixo:
						</p>
						<div className="flex flex-col gap-1.5">
							<Input
								type="password"
								{...regDelete("password")}
								placeholder="sua senha"
								className="bg-bg-2 border-border text-text-hi placeholder:text-text-lo h-9.5"
								autoFocus
							/>
							{deleteErrors.password && (
								<p className="text-[13px] m-0 text-error">
									{deleteErrors.password.message}
								</p>
							)}
						</div>
						{deleteMutation.error && (
							<p className="text-[13px] m-0 text-error">
								{deleteMutation.error.message}
							</p>
						)}
						<div className="flex gap-2">
							<Button
								variant="outline"
								type="submit"
								disabled={deleteMutation.isPending}
								className="h-9 rounded-[8px] text-[12.5px] text-error border-error/40 hover:bg-error/10"
							>
								{deleteMutation.isPending
									? "Excluindo..."
									: "Confirmar exclusão"}
							</Button>
							<Button
								variant="ghost"
								type="button"
								onClick={() => setDeleteOpen(false)}
								className="h-9 rounded-[8px] text-[12.5px] text-text-lo"
							>
								Cancelar
							</Button>
						</div>
					</form>
				)}
			</section>

			<div className="pt-2 border-t border-border-soft flex gap-4 text-[11.5px] text-text-lo">
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
