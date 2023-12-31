/*
 * Copyright 2020- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
// @vitest-environment jsdom

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/preact";

import { Input } from "./Input";

describe("Input", () => {
  it("should display the input with the given label", () => {
    const inputLabel = "Name";
    render(<Input label={inputLabel} />);

    const inputEl = screen.getByLabelText(inputLabel);

    expect(inputEl).toBeInTheDocument();
  });
});
