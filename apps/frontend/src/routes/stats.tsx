import { createFileRoute } from "@tanstack/react-router";
import { StatsScreen } from "@/features/stats/components/StatsScreen";

export const Route = createFileRoute("/stats")({
	component: StatsScreen,
});
