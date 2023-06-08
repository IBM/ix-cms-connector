/*
 * Copyright 2020- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
// @vitest-environment jsdom

import { describe, it, expect, vi } from "vitest";
import { act, render, screen, fireEvent } from "@testing-library/preact";
import { SearchInput } from "./SearchInput";

const mockLabel = "SearchInput";

describe("SearchInput", () => {
  it("should display SearchInput component", () => {
    const onSearchTextSpy = vi.fn();
    render(<SearchInput label={mockLabel} onSearchText={onSearchTextSpy} />);

    const searchElement = screen.getByLabelText(mockLabel);
    expect(searchElement).toBeInTheDocument();
  });

  it("should display close button when something is typed", async () => {
    vi.useFakeTimers();
    const onSearchTextSpy = vi.fn();
    render(<SearchInput label={mockLabel} onSearchText={onSearchTextSpy} />);

    const searchElement = screen.getByLabelText(mockLabel);
    fireEvent.change(searchElement, { target: { value: "test" } });

    await act(() => {
      vi.advanceTimersByTime(600);
    });

    const buttonEl = screen.getByRole("button");
    expect(buttonEl).toBeInTheDocument();
  });

  it("should clean the input when button is clicked", async () => {
    vi.useFakeTimers();
    const onSearchTextSpy = vi.fn();

    render(<SearchInput label={mockLabel} onSearchText={onSearchTextSpy} />);

    const searchInputElement = screen.getByLabelText(
      mockLabel
    ) as HTMLInputElement;
    fireEvent.change(searchInputElement, { target: { value: "test" } });

    await act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(searchInputElement.value).toBe("test");

    const buttonEl = screen.getByRole("button");
    fireEvent.click(buttonEl);

    expect(searchInputElement.value).toBe("");
  });

  it("should fire onSearchTextSpy when input text change", async () => {
    vi.useFakeTimers();
    const onSearchTextSpy = vi.fn();

    render(<SearchInput label={mockLabel} onSearchText={onSearchTextSpy} />);

    const searchInputElement = screen.getByLabelText(
      mockLabel
    ) as HTMLInputElement;
    fireEvent.change(searchInputElement, { target: { value: "test" } });

    await act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(onSearchTextSpy).toBeCalledWith("test");
  });

  it("should fire onSearchTextSpy when clear button is clicked", async () => {
    vi.useFakeTimers();
    const onSearchTextSpy = vi.fn();

    render(<SearchInput label={mockLabel} onSearchText={onSearchTextSpy} />);

    const searchInputElement = screen.getByLabelText(
      mockLabel
    ) as HTMLInputElement;
    fireEvent.change(searchInputElement, { target: { value: "test" } });

    await act(() => {
      vi.advanceTimersByTime(400);
    });

    const buttonEl = screen.getByRole("button");
    fireEvent.click(buttonEl);

    expect(onSearchTextSpy).toBeCalledWith("");
  });
});
