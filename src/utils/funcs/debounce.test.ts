/*
 * Copyright 2020- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { debounce } from "./debounce";

describe("debounce()", () => {
  it("should wait for 3 seconds", () => {
    vi.useFakeTimers();
    const fnSpy = vi.fn();

    const debouncedFn = debounce(fnSpy, 300);
    debouncedFn();

    expect(fnSpy).not.toBeCalled();

    vi.advanceTimersByTime(300);
    vi.runAllTimers();

    expect(fnSpy).toBeCalled();
  });

  it("should not run the function if time not passed", () => {
    const fnSpy = vi.fn();

    const debouncedFn = debounce(fnSpy, 300);
    debouncedFn();

    expect(fnSpy).not.toBeCalled();
  });
});
