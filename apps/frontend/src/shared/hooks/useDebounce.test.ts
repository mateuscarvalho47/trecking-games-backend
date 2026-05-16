import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDebounce } from "./useDebounce";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("useDebounce", () => {
	it("returns the initial value immediately", () => {
		const { result } = renderHook(() => useDebounce("hello", 500));
		expect(result.current).toBe("hello");
	});

	it("does not update before the delay expires", () => {
		const { result, rerender } = renderHook(
			({ value, delay }: { value: string; delay: number }) =>
				useDebounce(value, delay),
			{ initialProps: { value: "hello", delay: 500 } },
		);
		rerender({ value: "world", delay: 500 });
		vi.advanceTimersByTime(300);
		expect(result.current).toBe("hello");
	});

	it("updates value after delay elapses", () => {
		const { result, rerender } = renderHook(
			({ value, delay }: { value: string; delay: number }) =>
				useDebounce(value, delay),
			{ initialProps: { value: "hello", delay: 500 } },
		);
		rerender({ value: "world", delay: 500 });
		act(() => vi.advanceTimersByTime(500));
		expect(result.current).toBe("world");
	});

	it("resets the timer when value changes before delay expires", () => {
		const { result, rerender } = renderHook(
			({ value, delay }: { value: string; delay: number }) =>
				useDebounce(value, delay),
			{ initialProps: { value: "hello", delay: 500 } },
		);
		rerender({ value: "world", delay: 500 });
		vi.advanceTimersByTime(300);
		rerender({ value: "final", delay: 500 });
		vi.advanceTimersByTime(300);
		// Still hasn't reached 500ms from the last update
		expect(result.current).toBe("hello");
		act(() => vi.advanceTimersByTime(200));
		expect(result.current).toBe("final");
	});
});
