import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchStats } from "./statsService";

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

const STATS = {
	totalGames: 10,
	totalHours: 120,
	countByStatus: {
		WISHLIST: 1,
		BACKLOG: 2,
		PLAYING: 3,
		PAUSED: 1,
		COMPLETED: 2,
		DROPPED: 1,
	},
	topGenres: [{ genre: "RPG", count: 5 }],
	topPlatforms: [{ platform: "PC", count: 8 }],
	ratingDistribution: [{ rating: 5, count: 3 }],
	completedTimeline: [{ month: "2024-01", count: 1 }],
};

describe("fetchStats", () => {
	it("calls api.get /library/stats and returns stats", async () => {
		vi.mocked(api.get).mockResolvedValue(STATS);
		const result = await fetchStats();
		expect(result).toEqual(STATS);
		expect(api.get).toHaveBeenCalledWith("/library/stats");
	});
});
