import { render, screen } from "@testing-library/preact";
// Import jest-dom here to be able to use extended matchers like "toBeInTheDocument"
import "@testing-library/jest-dom";

import { Input } from "./index";

describe("Input", () => {
  test("should display the input with the given label", () => {
    const inputLabel = "Name";
    render(<Input label={inputLabel} />);

    const inputEl = screen.getByLabelText(inputLabel);

    // TODO: move to readme file as example
    // screen.debug(inputEl);

    expect(inputEl).toBeInTheDocument();
  });
});
