import { createFileRoute } from "@tanstack/react-router";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { usePageTitle } from "@/shared/hooks/usePageTitle";

export const Route = createFileRoute("/login")({
	component: LoginPage,
});

function LoginPage() {
	usePageTitle("Entrar");
	return <AuthShell mode="login" />;
}
