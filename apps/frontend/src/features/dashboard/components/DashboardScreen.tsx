import { useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { useLibrary } from "@/features/library/hooks/useLibrary";
import { useStats } from "@/features/stats/hooks/useStats";
import { useSearchModal } from "@/shared/hooks/useSearchModal";
import { ActivityRibbon } from "./ActivityRibbon";
import { BacklogList } from "./BacklogList";
import { PlayingList } from "./PlayingList";
import { RecentList } from "./RecentList";
import { StatTiles } from "./StatTiles";
import { StatusBarsCard } from "./StatusBarsCard";

export function DashboardScreen() {
	const { setOpen } = useSearchModal();

	const { data: library = [], isLoading: libraryLoading } = useLibrary();
	const { data: stats, isLoading: statsLoading } = useStats();

	const { playing, backlog, recent } = useMemo(() => {
		const playing = library.filter((g) => g.status === "PLAYING");
		const backlog = library.filter((g) => g.status === "BACKLOG");
		const recent = library
			.filter((g) => g.status === "COMPLETED")
			.sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""));
		return { playing, backlog, recent };
	}, [library]);

	if (libraryLoading || statsLoading || !stats) {
		return (
			<div className="px-6 pt-7">
				<div className="flex flex-col gap-4">
					{[1, 2, 3].map((i) => (
						<div key={i} className="h-20 bg-bg-1 rounded-lg animate-pulse" />
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="px-6 pt-7 pb-15">
			{/* Topbar */}
			<div className="flex items-end justify-between gap-3 pb-5.5 mb-5.5 border-b border-border-soft flex-wrap">
				<PageHeader
					overline="Início"
					title="Dashboard"
					subtitle="Visão geral da sua biblioteca"
				/>
				<Button
					variant="accent"
					size="sm"
					onClick={() => setOpen(true)}
					className="rounded-lg"
				>
					+ Adicionar jogo
				</Button>
			</div>

			{/* Grid */}
			<div className="flex flex-col gap-5">
				<StatTiles stats={stats} />
				<ActivityRibbon library={library} />
				<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					<PlayingList games={playing} />
					<BacklogList games={backlog} />
				</div>
				<div className="grid grid-cols-1 md:grid-cols-[7fr_5fr] gap-5">
					<RecentList games={recent} />
					<StatusBarsCard stats={stats} />
				</div>
			</div>
		</div>
	);
}
