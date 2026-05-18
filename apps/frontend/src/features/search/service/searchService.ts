import { api } from "@/lib/api";
import type { GameDetail, GameSearchResult } from "@/types/api";

export function searchGames(query: string) {
	return api.get<GameSearchResult[]>(
		`/games/search?q=${encodeURIComponent(query)}`,
	);
}

export function fetchGameDetail(igdbId: number) {
	return api.get<GameDetail>(`/games/${igdbId}`);
}
