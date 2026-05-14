import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useLibrary } from "@/features/library/hooks/useLibrary";
import { STATUSES } from "@/shared/constants/statuses";
import { useSearchModal } from "@/shared/hooks/useSearchModal";
import type { GameStatus, LibraryEntry, LibraryStats } from "@/types/api";
import { ActivityRibbon } from "./ActivityRibbon";
import { BacklogList } from "./BacklogList";
import { PlayingList } from "./PlayingList";
import { RecentList } from "./RecentList";
import { StatTiles } from "./StatTiles";
import { StatusBarsCard } from "./StatusBarsCard";

function computeStats(library: LibraryEntry[]): LibraryStats {
	const countByStatus = Object.fromEntries(
		STATUSES.map((s) => [s.key, 0]),
	) as Record<GameStatus, number>;

	const genreMap = new Map<string, number>();
	const platformMap = new Map<string, number>();
	const ratingMap = new Map<number, number>();
	const timelineMap = new Map<string, number>();

	let totalHours = 0;
	for (const g of library) {
		countByStatus[g.status] = (countByStatus[g.status] ?? 0) + 1;
		if (g.hoursPlayed) totalHours += g.hoursPlayed;
		for (const genre of g.genres)
			genreMap.set(genre, (genreMap.get(genre) ?? 0) + 1);
		const plat = g.userPlatform ?? g.platforms[0];
		if (plat) platformMap.set(plat, (platformMap.get(plat) ?? 0) + 1);
		if (g.rating != null) {
			const r = Math.round(g.rating);
			ratingMap.set(r, (ratingMap.get(r) ?? 0) + 1);
		}
		if (g.completedAt) {
			const month = g.completedAt.slice(0, 7);
			timelineMap.set(month, (timelineMap.get(month) ?? 0) + 1);
		}
	}

	return {
		totalGames: library.length,
		totalHours,
		countByStatus,
		topGenres: [...genreMap.entries()]
			.sort((a, b) => b[1] - a[1])
			.slice(0, 8)
			.map(([genre, count]) => ({ genre, count })),
		topPlatforms: [...platformMap.entries()]
			.sort((a, b) => b[1] - a[1])
			.slice(0, 8)
			.map(([platform, count]) => ({ platform, count })),
		ratingDistribution: [...ratingMap.entries()]
			.sort((a, b) => a[0] - b[0])
			.map(([rating, count]) => ({ rating, count })),
		completedTimeline: [...timelineMap.entries()]
			.sort()
			.map(([month, count]) => ({ month, count })),
	};
}

export function DashboardScreen() {
	const { setOpen } = useSearchModal();

	const { data: library = [], isLoading } = useLibrary();

	const { stats, playing, backlog, recent } = useMemo(() => {
		const stats = computeStats(library);
		const playing = library.filter((g) => g.status === "PLAYING");
		const backlog = library.filter((g) => g.status === "BACKLOG");
		const recent = library
			.filter((g) => g.status === "COMPLETED")
			.sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""));
		return { stats, playing, backlog, recent };
	}, [library]);

	if (isLoading) {
		return (
			<div className="px-5.5 pt-7">
				<div className="flex flex-col gap-4">
					{[1, 2, 3].map((i) => (
						<div key={i} className="h-20 bg-bg-1 rounded-lg animate-pulse" />
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="px-5.5 pt-7 pb-15">
			{/* Topbar */}
			<div className="flex items-end justify-between gap-3 pb-5.5 mb-5.5 border-b border-border-soft flex-wrap">
				<div>
					<div className="page-overline">Início</div>
					<h1 className="text-[28px] font-semibold tracking-tight m-0 text-text-hi">
						Dashboard
					</h1>
					<p className="text-text-md text-[13.5px] mt-1.5 mb-0">
						Visão geral da sua biblioteca
					</p>
				</div>
				<Button
					variant="accent"
					size="sm"
					onClick={() => setOpen(true)}
					className="rounded-[8px]"
				>
					+ Adicionar jogo
				</Button>
			</div>

			{/* Grid */}
			<div className="flex flex-col gap-4.5">
				<StatTiles stats={stats} />
				<ActivityRibbon library={library} />
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
					<PlayingList games={playing} />
					<BacklogList games={backlog} />
				</div>
				<div className="grid grid-cols-1 md:grid-cols-[7fr_5fr] gap-4.5">
					<RecentList games={recent} />
					<StatusBarsCard stats={stats} />
				</div>
			</div>
		</div>
	);
}
