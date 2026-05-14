import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, api } from "./api";

function mockFetch(status: number, body: unknown) {
	return vi.spyOn(globalThis, "fetch").mockResolvedValue({
		ok: status >= 200 && status < 300,
		status,
		json: () => Promise.resolve(body),
	} as Response);
}

afterEach(() => vi.restoreAllMocks());

describe("ApiError", () => {
	it("sets name, code, message, details and status", () => {
		const err = new ApiError("NOT_FOUND", "Not found", { id: 1 }, 404);
		expect(err.name).toBe("ApiError");
		expect(err.code).toBe("NOT_FOUND");
		expect(err.message).toBe("Not found");
		expect(err.details).toEqual({ id: 1 });
		expect(err.status).toBe(404);
		expect(err).toBeInstanceOf(Error);
	});

	it("allows undefined details and status", () => {
		const err = new ApiError("ERR", "oops");
		expect(err.details).toBeUndefined();
		expect(err.status).toBeUndefined();
	});
});

describe("api.get", () => {
	it("returns parsed JSON on success", async () => {
		mockFetch(200, { id: "1" });
		const result = await api.get<{ id: string }>("/games");
		expect(result).toEqual({ id: "1" });
	});

	it("throws ApiError with server error payload on failure", async () => {
		mockFetch(404, { error: { code: "NOT_FOUND", message: "Game not found" } });
		await expect(api.get("/games/999")).rejects.toMatchObject({
			code: "NOT_FOUND",
			message: "Game not found",
			status: 404,
		});
	});

	it("throws ApiError with UNKNOWN_ERROR when response has no error body", async () => {
		mockFetch(500, {});
		await expect(api.get("/broken")).rejects.toMatchObject({
			code: "UNKNOWN_ERROR",
		});
	});
});

describe("api.post", () => {
	it("sends JSON body and returns response", async () => {
		const spy = mockFetch(201, { id: "42" });
		const result = await api.post<{ id: string }>("/library", {
			igdbId: 1,
			status: "PLAYING",
		});
		expect(result).toEqual({ id: "42" });
		expect(spy).toHaveBeenCalledWith(
			"/api/library",
			expect.objectContaining({
				method: "POST",
				body: JSON.stringify({ igdbId: 1, status: "PLAYING" }),
			}),
		);
	});
});

describe("api.delete", () => {
	it("returns undefined for 204 No Content", async () => {
		mockFetch(204, null);
		const result = await api.delete("/library/1");
		expect(result).toBeUndefined();
	});
});
