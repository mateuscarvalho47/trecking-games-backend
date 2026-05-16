import { useNavigate } from "@tanstack/react-router";
import { Cover } from "@/shared/components/Cover";
import { STATUS_BY_KEY } from "@/shared/constants/statuses";
import type { LibraryEntry } from "@/types/api";

const PLAYING_HUE = STATUS_BY_KEY.PLAYING.hue;

import { useSearchModal } from "@/shared/hooks/useSearchModal";

interface PlayingListProps {
	games: LibraryEntry[];
}

export function PlayingList({ games }: PlayingListProps) {
	const navigate = useNavigate();
	const { setOpen } = useSearchModal();

	return (
		<div className="bg-bg-1 border border-border-soft rounded-lg px-5.5 py-4.5">
			<div className="flex items-start justify-between mb-3.5">
				<div>
					<div className="text-[14.5px] font-semibold text-text-hi tracking-[-0.01em]">
						Jogando agora
					</div>
					<div className="font-mono text-[11.5px] text-text-lo mt-0.5">
						{games.length} jogo{games.length !== 1 ? "s" : ""}
					</div>
				</div>
				<button
					type="button"
					onClick={() => setOpen(true)}
					className="inline-flex items-center gap-1 bg-transparent border-0 text-text-md text-[11.5px] font-mono cursor-pointer px-1.5 py-1"
				>
					+ Adicionar
				</button>
			</div>

			{games.length === 0 ? (
				<div className="py-6 text-center text-text-lo text-[13px]">
					Nenhum jogo em andamento
				</div>
			) : (
				<div className="flex flex-col gap-2.5">
					{games.map((game) => (
						<button
							type="button"
							key={game.igdbId}
							onClick={() =>
								navigate({
									to: "/library/$igdbId",
									params: { igdbId: String(game.igdbId) },
								})
							}
							className="grid grid-cols-[48px_1fr_auto] gap-3.5 items-center p-2 bg-transparent border-0 rounded-[8px] cursor-pointer text-left transition-[background] w-full hover:bg-bg-2 font-[inherit]"
						>
							<div className="w-12 h-16 rounded-sm overflow-hidden">
								<Cover
									game={{
										name: game.name,
										year: undefined,
										platforms: game.platforms,
										cover: {
											hue: PLAYING_HUE,
											scheme: "duotone" as const,
											glyph: game.name[0],
										},
										coverUrl: game.coverUrl,
									}}
									size="sm"
									withTitle={false}
								/>
							</div>
							<div className="flex flex-col gap-1 min-w-0">
								<span className="text-[13.5px] font-medium text-text-hi truncate">
									{game.name}
								</span>
								<span className="text-[11.5px] text-text-md">
									{game.userPlatform ?? game.platforms[0]}
									{game.hoursPlayed ? ` · ${game.hoursPlayed}h` : ""}
								</span>
								{game.hoursPlayed && (
									<div className="h-1 bg-border-soft rounded-full overflow-hidden mt-1">
										<div
											className="h-full rounded-full transition-[width] duration-700 ease-out gradient-accent-bar"
											style={{
												width: `${Math.min((game.hoursPlayed / 100) * 100, 100)}%`,
											}}
										/>
									</div>
								)}
							</div>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
