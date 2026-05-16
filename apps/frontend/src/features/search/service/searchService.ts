import { api } from "@/lib/api";
import type { GameSearchResult } from "@/types/api";

export function searchGames(query: string) {
	return api.get<GameSearchResult[]>(
		`/games/search?q=${encodeURIComponent(query)}`,
	);
}
