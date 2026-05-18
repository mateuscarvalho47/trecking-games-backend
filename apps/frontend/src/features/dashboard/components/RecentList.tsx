import { useNavigate } from "@tanstack/react-router";
import { Cover } from "@/shared/components/Cover";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { STATUS_BY_KEY } from "@/shared/constants/statuses";
import type { LibraryEntry } from "@/types/api";

const COMPLETED_HUE = STATUS_BY_KEY.COMPLETED.hue;

interface RecentListProps {
	games: LibraryEntry[];
}

export function RecentList({ games }: RecentListProps) {
	const navigate = useNavigate();
	const shown = games.slice(0, 3);

	return (
		<div className="bg-bg-1 border border-border-soft rounded-lg px-5.5 py-4.5">
			<div className="text-[15.5px] font-semibold text-text-hi tracking-[-0.01em] mb-3.5">
				Recém-completos
			</div>
			{shown.length === 0 ? (
				<div className="py-6 text-center text-text-lo text-[14px]">
					Nenhum jogo completado ainda
				</div>
			) : (
				<div className="grid grid-cols-3 gap-2.5 md:gap-3.5">
					{shown.map((game) => (
						<button
							type="button"
							key={game.igdbId}
							onClick={() =>
								navigate({
									to: "/library/$igdbId",
									params: { igdbId: String(game.igdbId) },
								})
							}
							className="flex flex-col gap-2.5 p-0 bg-transparent border-0 cursor-pointer text-left font-[inherit] min-w-0"
						>
							<div className="aspect-3/4 rounded-sm overflow-hidden">
								<Cover
									game={{
										name: game.name,
										platforms: game.platforms,
										cover: {
											hue: COMPLETED_HUE,
											scheme: "duotone" as const,
											glyph: game.name[0],
										},
										coverUrl: game.coverUrl,
									}}
									size="md"
									hover
								/>
							</div>
							<div className="flex flex-col gap-1">
								<span className="text-[14px] font-medium text-text-hi truncate">
									{game.name}
								</span>
								<div className="flex items-center justify-between gap-1 flex-wrap">
									<StatusBadge status={game.status} size="sm" />
									{game.rating != null && (
										<span className="font-mono text-[13px] font-semibold text-text-hi">
											{game.rating}
											<span className="text-[12px] text-text-lo">/10</span>
										</span>
									)}
								</div>
							</div>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
