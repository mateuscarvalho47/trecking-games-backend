import { useQuery } from "@tanstack/react-query";
import type { LibraryStats } from "@/types/api";
import { fetchStats } from "../service/statsService";

export function useStats() {
	return useQuery<LibraryStats>({
		queryKey: ["stats"],
		queryFn: fetchStats,
	});
}
