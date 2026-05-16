import { createFileRoute, redirect } from "@tanstack/react-router";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { fetchMe } from "@/features/auth/service/authService";
import { usePageTitle } from "@/shared/hooks/usePageTitle";

export const Route = createFileRoute("/login")({
	beforeLoad: async ({ context }) => {
		const me = await context.queryClient.fetchQuery({
			queryKey: ["me"],
			queryFn: fetchMe,
			staleTime: 1000 * 60 * 5,
		});
		if (me) throw redirect({ to: "/" });
	},
	component: LoginPage,
});

function LoginPage() {
	usePageTitle("Entrar");
	return <AuthShell mode="login" />;
}
