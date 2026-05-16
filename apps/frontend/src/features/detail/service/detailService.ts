import { api } from "@/lib/api";
import type { LibraryEntry } from "@/types/api";

export function fetchLibraryEntry(igdbId: number) {
	return api.get<LibraryEntry[]>("/library").then((list) => {
		const entry = list.find((e) => e.igdbId === igdbId);
		if (!entry) throw new Error("Jogo não encontrado na biblioteca");
		return entry;
	});
}

export function updateLibraryEntry(id: string, data: Partial<LibraryEntry>) {
	return api.patch<LibraryEntry>(`/library/${id}`, data);
}

export function removeLibraryEntry(id: string) {
	return api.delete(`/library/${id}`);
}
