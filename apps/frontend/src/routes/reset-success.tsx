import { createFileRoute } from "@tanstack/react-router";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { PasswordResetSuccess } from "@/features/auth/components/PasswordResetSuccess";
import { usePageTitle } from "@/shared/hooks/usePageTitle";

export const Route = createFileRoute("/reset-success")({
	component: ResetPasswordSuccessPage,
});

function ResetPasswordSuccessPage() {
	usePageTitle("Senha alterada");
	return (
		<AuthShell>
			<PasswordResetSuccess />
		</AuthShell>
	);
}
