// @vitest-environment jsdom

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/preact";

import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("should be present on the DOM with the given label", () => {
    const label = "Checkbox label";
    render(<Checkbox id="checkbox-1" label={label} />);

    const checkboxEl = screen.getByLabelText(label);
    expect(checkboxEl).toBeInTheDocument();
  });
});
