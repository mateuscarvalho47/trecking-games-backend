import { createFileRoute } from "@tanstack/react-router";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { usePageTitle } from "@/shared/hooks/usePageTitle";

export const Route = createFileRoute("/register")({
	component: RegisterPage,
});

function RegisterPage() {
	usePageTitle("Criar conta");
	return <AuthShell mode="register" />;
}
