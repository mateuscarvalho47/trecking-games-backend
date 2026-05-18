import { createFileRoute } from "@tanstack/react-router";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { RequestResetForm } from "@/features/auth/components/RequestResetForm";
import { usePageTitle } from "@/shared/hooks/usePageTitle";

export const Route = createFileRoute("/forgot-password")({
	component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
	usePageTitle("Recuperar senha");
	return (
		<AuthShell>
			<RequestResetForm />
		</AuthShell>
	);
}
