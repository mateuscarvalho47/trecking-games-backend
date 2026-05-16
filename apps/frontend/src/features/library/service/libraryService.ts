import { api } from "@/lib/api";
import type { LibraryEntry } from "@/types/api";

export function fetchLibrary() {
	return api.get<LibraryEntry[]>("/library");
}

export function addToLibrary(data: {
	igdbId: number;
	status: string;
	userPlatform?: string;
}) {
	return api.post<LibraryEntry>("/library", data);
}
