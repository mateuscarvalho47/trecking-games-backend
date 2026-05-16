import { useQuery } from "@tanstack/react-query";
import type { GameSearchResult } from "@/types/api";
import { searchGames } from "../service/searchService";

export function useGameSearch(query: string) {
	return useQuery<GameSearchResult[]>({
		queryKey: ["search", query],
		queryFn: () => searchGames(query),
		enabled: query.trim().length >= 2,
		staleTime: 1000 * 30,
	});
}
