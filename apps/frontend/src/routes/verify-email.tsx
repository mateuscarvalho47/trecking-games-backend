import { createFileRoute } from "@tanstack/react-router";
import { VerifyEmailScreen } from "@/features/auth/components/VerifyEmailScreen";

export const Route = createFileRoute("/verify-email")({
	component: VerifyEmailPage,
});

function VerifyEmailPage() {
	return <VerifyEmailScreen />;
}
