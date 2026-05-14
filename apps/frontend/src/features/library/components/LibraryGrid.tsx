import type { LibraryEntry } from "@/types/api";
import { LibraryCard } from "./LibraryCard";

interface LibraryGridProps {
	games: LibraryEntry[];
}

export function LibraryGrid({ games }: LibraryGridProps) {
	return (
		<div
			className="gap-4.5"
			style={{
				display: "grid",
				gridTemplateColumns:
					"repeat(auto-fill, minmax(min(180px, calc(50% - 18px)), 1fr))",
			}}
		>
			{games.map((game) => (
				<LibraryCard key={game.igdbId} game={game} />
			))}
		</div>
	);
}
