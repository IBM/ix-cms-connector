/*
 * Copyright 2020- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */

// @vitest-environment jsdom

import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/preact";

import { Checkbox } from "./Checkbox";

const label = "Checkbox label";

describe("Checkbox", () => {
  it("should be present on the DOM with the given label", () => {
    const spyCheckboxChecked = vi.fn();
    render(
      <Checkbox
        id="checkbox-1"
        label={label}
        handleOptionSelect={spyCheckboxChecked}
      />
    );

    const checkboxEl = screen.getByLabelText(label);
    expect(checkboxEl).toBeInTheDocument();
  });

  it("should appear as checked if the user clicks on it once", () => {
    const spyCheckboxChecked = vi.fn();

    render(
      <Checkbox
        id="checkbox-1"
        label={label}
        handleOptionSelect={spyCheckboxChecked}
      />
    );

    const checkboxEl = screen.getByLabelText(label);
    fireEvent.click(checkboxEl);

    const checkboxEl_checked = screen.getByRole("checkbox", { checked: true });

    expect(checkboxEl_checked).toBeInTheDocument();
  });

  it("should call the spy function at least once when the user clicks on the checkbox", () => {
    const spyCheckboxChecked = vi.fn();

    render(
      <Checkbox
        id="checkbox-1"
        label={label}
        handleOptionSelect={spyCheckboxChecked}
      />
    );

    const checkboxEl = screen.getByLabelText(label);
    fireEvent.click(checkboxEl);

    expect(spyCheckboxChecked).toHaveBeenCalledOnce();
  });
});
