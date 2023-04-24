import { render, screen } from "@testing-library/preact";

import { Input } from "./index";

describe("Input", () => {
  it("should display the input with the given label", () => {
    const inputLabel = "Name";
    render(<Input label={inputLabel} />);

    const inputEl = screen.getByLabelText(inputLabel);

    expect(inputEl).toBeInTheDocument();
  });
});
