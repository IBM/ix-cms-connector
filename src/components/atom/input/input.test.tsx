// import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/preact";

import { Input } from "./index";

describe("Input", () => {
  test("should display the input with the given label", () => {
    const inputLabel = "Name";
    render(<Input label={inputLabel} />);

    const inputEl = screen.getByLabelText(inputLabel);

    // TODO: move to readme file as example
    // screen.debug(inputEl);

    // TODO: fix extend matchers from jest-dom
    // expect(inputEl).toBeInTheDocument();

    expect(inputEl).toBeDefined();
    expect(inputEl).not.toBeDefined();
  });
});
