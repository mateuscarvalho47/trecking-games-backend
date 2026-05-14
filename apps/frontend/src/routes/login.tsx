import { createFileRoute } from "@tanstack/react-router";
import { AuthShell } from "@/features/auth/components/AuthShell";

export const Route = createFileRoute("/login")({
	component: LoginPage,
});

function LoginPage() {
	return <AuthShell mode="login" />;
}
