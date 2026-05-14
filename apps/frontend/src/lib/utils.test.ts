import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
	it("merges class names", () => {
		expect(cn("foo", "bar")).toBe("foo bar");
	});

	it("deduplicates conflicting tailwind classes (last wins)", () => {
		expect(cn("p-2", "p-4")).toBe("p-4");
		expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
	});

	it("ignores falsy values", () => {
		expect(cn("foo", false, null, undefined, "bar")).toBe("foo bar");
	});

	it("supports conditional objects", () => {
		expect(cn("base", { active: true, disabled: false })).toBe("base active");
	});

	it("returns empty string when no classes", () => {
		expect(cn()).toBe("");
	});
});
