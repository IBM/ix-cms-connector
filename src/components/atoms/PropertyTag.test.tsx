/*
 * Copyright 2020- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
// @vitest-environment jsdom

import { expect, it, describe } from "vitest";
import { render, screen } from "@testing-library/preact";

import { PropertyTag } from "./PropertyTag";

describe("PropertyTag", () => {
  it("should display a PropertyTag Component", () => {
    const labelStr = "string";
    render(<PropertyTag label={labelStr} />);

    const tagEl = screen.getByText(labelStr);

    expect(tagEl).toBeInTheDocument();
  });
});
