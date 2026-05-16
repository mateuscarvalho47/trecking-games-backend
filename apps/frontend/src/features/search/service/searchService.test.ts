import { afterEach, describe, expect, it, vi } from "vitest";
import { searchGames } from "./searchService";

vi.mock("@/lib/api", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/lib/api")>();
	return {
		...actual,
		api: {
			get: vi.fn(),
		},
	};
});

import { api } from "@/lib/api";

afterEach(() => vi.clearAllMocks());

const RESULTS = [
	{
		igdbId: 1,
		name: "Elden Ring",
		platforms: ["PC", "PS5"],
		genres: ["RPG"],
	},
];

describe("searchGames", () => {
	it("calls api.get with URL-encoded query", async () => {
		vi.mocked(api.get).mockResolvedValue(RESULTS);
		const result = await searchGames("elden ring");
		expect(result).toEqual(RESULTS);
		expect(api.get).toHaveBeenCalledWith(
			`/games/search?q=${encodeURIComponent("elden ring")}`,
		);
	});

	it("encodes special characters in query", async () => {
		vi.mocked(api.get).mockResolvedValue([]);
		await searchGames("zelda & link");
		expect(api.get).toHaveBeenCalledWith(
			`/games/search?q=${encodeURIComponent("zelda & link")}`,
		);
	});
});
