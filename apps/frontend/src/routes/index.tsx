import { createFileRoute } from "@tanstack/react-router";
import { useMe } from "@/features/auth/hooks/useAuth";
import { DashboardScreen } from "@/features/dashboard/components/DashboardScreen";
import { LandingScreen } from "@/features/landing/components/LandingScreen";

export const Route = createFileRoute("/")({
	component: IndexPage,
});

function IndexPage() {
	const { data: me, isLoading } = useMe();
	if (isLoading) return null;
	return me ? <DashboardScreen /> : <LandingScreen />;
}
