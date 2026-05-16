import { afterEach, describe, expect, it, vi } from "vitest";
import { addToLibrary, fetchLibrary } from "./libraryService";

vi.mock("@/lib/api", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/lib/api")>();
	return {
		...actual,
		api: {
			get: vi.fn(),
			post: vi.fn(),
		},
	};
});

import { api } from "@/lib/api";

afterEach(() => vi.clearAllMocks());

const ENTRY = {
	id: "entry-1",
	igdbId: 1,
	name: "Elden Ring",
	genres: ["RPG"],
	platforms: ["PC"],
	status: "BACKLOG" as const,
	createdAt: "2024-01-01T00:00:00Z",
	updatedAt: "2024-01-01T00:00:00Z",
};

describe("fetchLibrary", () => {
	it("calls api.get /library and returns entries", async () => {
		vi.mocked(api.get).mockResolvedValue([ENTRY]);
		const result = await fetchLibrary();
		expect(result).toEqual([ENTRY]);
		expect(api.get).toHaveBeenCalledWith("/library");
	});
});

describe("addToLibrary", () => {
	it("calls api.post /library with igdbId and status", async () => {
		vi.mocked(api.post).mockResolvedValue(ENTRY);
		const data = { igdbId: 1, status: "BACKLOG" };
		const result = await addToLibrary(data);
		expect(result).toEqual(ENTRY);
		expect(api.post).toHaveBeenCalledWith("/library", data);
	});

	it("includes optional userPlatform when provided", async () => {
		vi.mocked(api.post).mockResolvedValue(ENTRY);
		const data = { igdbId: 1, status: "PLAYING", userPlatform: "PC" };
		await addToLibrary(data);
		expect(api.post).toHaveBeenCalledWith("/library", data);
	});
});
