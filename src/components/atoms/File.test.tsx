/*
 * Copyright 2020- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
// @vitest-environment jsdom

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/preact";

import { File } from "./File";

const filename = "testfile.json";

describe("File", () => {
  it("should display a File", () => {
    render(<File name={filename} />);

    const fileEl = screen.getByText(filename);

    expect(fileEl).toBeInTheDocument();
  });

  it("should show spinner if isLoading is true", () => {
    const isLoading = true;
    render(<File name={filename} isLoading={isLoading} />);

    const loadingEl = screen.getByTitle("loading");

    expect(loadingEl).toBeInTheDocument();
    expect(loadingEl).toHaveTextContent("loading");
  });

  it("should invoke onRemoveFile(), if the x-button is clicked", () => {
    const buttonSpy = vi.fn();
    render(<File name={filename} onRemoveFile={buttonSpy} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(buttonSpy).toBeCalled();
  });

  it("should diplay a success icon instead of the x-button, if no onRemoveFile() Callback is provided", () => {
    render(<File name={filename} />);

    const checkmarkIcon = screen.getByRole("status");

    expect(checkmarkIcon).not.toHaveTextContent("loading");
  });
});
