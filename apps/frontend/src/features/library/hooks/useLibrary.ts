import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { LibraryEntry } from "@/types/api";
import { addToLibrary, fetchLibrary } from "../service/libraryService";

export function useLibrary(opts?: { enabled?: boolean }) {
	return useQuery<LibraryEntry[]>({
		queryKey: ["library"],
		queryFn: fetchLibrary,
		enabled: opts?.enabled,
	});
}

export function useAddToLibrary() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: addToLibrary,
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["library"] });
		},
	});
}
