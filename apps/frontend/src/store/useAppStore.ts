import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GameStatus } from "@/types/api";

export type LibraryView = "grid" | "list";
export type LibrarySortField = "createdAt" | "name" | "rating" | "hoursPlayed";

interface AppStore {
	// Search modal
	searchOpen: boolean;
	setSearchOpen: (open: boolean) => void;

	// Library UI state — persisted so survives navigation
	libraryView: LibraryView;
	setLibraryView: (view: LibraryView) => void;

	libraryStatusFilter: GameStatus | null;
	setLibraryStatusFilter: (status: GameStatus | null) => void;

	librarySortField: LibrarySortField;
	setLibrarySortField: (field: LibrarySortField) => void;

	librarySearch: string;
	setLibrarySearch: (q: string) => void;
}

export const useAppStore = create<AppStore>()(
	persist(
		(set) => ({
			// Search modal — not persisted, but in same store for convenience
			searchOpen: false,
			setSearchOpen: (open) => set({ searchOpen: open }),

			// Library state — persisted
			libraryView: "grid",
			setLibraryView: (view) => set({ libraryView: view }),

			libraryStatusFilter: null,
			setLibraryStatusFilter: (status) => set({ libraryStatusFilter: status }),

			librarySortField: "createdAt",
			setLibrarySortField: (field) => set({ librarySortField: field }),

			librarySearch: "",
			setLibrarySearch: (q) => set({ librarySearch: q }),
		}),
		{
			name: "cartucheira-ui",
			// Only persist non-transient UI state
			partialize: (state) => ({
				libraryView: state.libraryView,
				librarySortField: state.librarySortField,
			}),
		},
	),
);
