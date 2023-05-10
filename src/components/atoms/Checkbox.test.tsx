// @vitest-environment jsdom

import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/preact";

import { Checkbox } from "./Checkbox";

const label = "Checkbox label";

describe("Checkbox", () => {
  it("should be present on the DOM with the given label", () => {
    const spyChecked = vi.fn();
    render(
      <Checkbox id="checkbox-1" label={label} handleOptionSelect={spyChecked} />
    );

    const checkboxEl = screen.getByLabelText(label);
    expect(checkboxEl).toBeInTheDocument();
  });

  it("should appear as checked if the user clicks on it once", () => {
    const spyChecked = vi.fn();
    render(
      <Checkbox id="checkbox-1" label={label} handleOptionSelect={spyChecked} />
    );

    const checkboxEl = screen.getByLabelText(label);
    fireEvent.click(checkboxEl);

    //TODO: finish
  });
});
