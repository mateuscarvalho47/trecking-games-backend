import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { VerifyResetForm } from "@/features/auth/components/VerifyResetForm";
import { usePageTitle } from "@/shared/hooks/usePageTitle";

const searchSchema = z.object({
	email: z.string().email(),
});

export const Route = createFileRoute("/reset-password")({
	validateSearch: searchSchema,
	component: ResetPasswordPage,
});

function ResetPasswordPage() {
	usePageTitle("Redefinir senha");
	const { email } = Route.useSearch();
	return (
		<AuthShell>
			<VerifyResetForm email={email} />
		</AuthShell>
	);
}
