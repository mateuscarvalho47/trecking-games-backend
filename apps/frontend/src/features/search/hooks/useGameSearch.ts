import { useQuery } from "@tanstack/react-query";
import type { GameDetail, GameSearchResult } from "@/types/api";
import { fetchGameDetail, searchGames } from "../service/searchService";

export function useGameSearch(query: string) {
	return useQuery<GameSearchResult[]>({
		queryKey: ["search", query],
		queryFn: () => searchGames(query),
		enabled: query.trim().length >= 2,
		staleTime: 1000 * 30,
	});
}

export function useGameDetail(igdbId: number | undefined) {
	return useQuery<GameDetail>({
		queryKey: ["game", igdbId],
		queryFn: () => fetchGameDetail(igdbId as number),
		enabled: igdbId != null,
		staleTime: 1000 * 60 * 10,
	});
}
