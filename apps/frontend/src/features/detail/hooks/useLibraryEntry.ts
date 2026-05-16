import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { LibraryEntry } from "@/types/api";
import {
	fetchLibraryEntry,
	removeLibraryEntry,
	updateLibraryEntry,
} from "../service/detailService";

export function useLibraryEntry(igdbId: number) {
	const qc = useQueryClient();
	return useQuery<LibraryEntry>({
		queryKey: ["library", igdbId],
		queryFn: async () => {
			const cached = qc.getQueryData<LibraryEntry[]>(["library"]);
			if (cached) {
				const entry = cached.find((e) => e.igdbId === igdbId);
				if (entry) return entry;
			}
			return fetchLibraryEntry(igdbId);
		},
		initialData: () =>
			qc
				.getQueryData<LibraryEntry[]>(["library"])
				?.find((e) => e.igdbId === igdbId),
		initialDataUpdatedAt: () => qc.getQueryState(["library"])?.dataUpdatedAt,
	});
}

export function useUpdateLibraryEntry(id: string, igdbId: number) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (data: Partial<LibraryEntry>) => updateLibraryEntry(id, data),
		onSuccess: (updated) => {
			qc.setQueryData(["library", igdbId], updated);
			qc.invalidateQueries({ queryKey: ["library"] });
		},
	});
}

export function useRemoveLibraryEntry(id: string) {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: () => removeLibraryEntry(id),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["library"] });
		},
	});
}
