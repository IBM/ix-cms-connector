// @vitest-environment jsdom

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/preact";
import userEvent from "@testing-library/user-event";

import { Button, ButtonType } from "./Button";

const mockLabel = "Click here";

describe("Button", () => {
  it("should display the button in the dom", () => {
    render(<Button text={mockLabel} style={ButtonType.PRIMARY} />);

    const buttonElement = screen.getByTestId("button");
    expect(buttonElement).toBeInTheDocument();
  });

  it("should display the button with the correct label", () => {
    // add test here
  });

  it("should call the onClick event", () => {
    // add test here
  });
});
