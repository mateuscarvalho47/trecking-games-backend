import { api } from "@/lib/api";
import type { LibraryStats } from "@/types/api";

export function fetchStats() {
	return api.get<LibraryStats>("/library/stats");
}
