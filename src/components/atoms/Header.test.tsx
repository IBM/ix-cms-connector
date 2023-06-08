/*
 * Copyright 2020- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
// @vitest-environment jsdom

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/preact";

import { Header } from "./Header";

describe("Header", () => {
  it("should be rendered on the screen", () => {
    render(<Header />);

    const headerEl = screen.getByTestId("header-component");
    expect(headerEl).toBeInTheDocument();
  });

  it("should match the existing snapshot", () => {
    render(<Header />);

    const headerEl = screen.getByTestId("header-component");
    expect(headerEl).toMatchSnapshot();
  });
});
