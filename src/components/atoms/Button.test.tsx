// @vitest-environment jsdom

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/preact";

import userEvent from "@testing-library/user-event";

import { Button, ButtonType } from "./Button";

const mockLabel = "Click here";
const testId = "button";

describe("Button", () => {
  it("should display the button in the dom", () => {
    render(<Button text={mockLabel} style={ButtonType.PRIMARY} />);

    const buttonElement = screen.getByTestId("button");
    expect(buttonElement).toBeInTheDocument();
  });

  it("should display the button with the correct label", () => {
    render(<Button text={mockLabel} style={ButtonType.PRIMARY} />);

    const buttonElement = screen.getByText(mockLabel);
    expect(buttonElement).toBeInTheDocument();
  });

  it("should display the button with primary style", () => {
    render(<Button text={mockLabel} style={ButtonType.PRIMARY} />);

    const buttonElement = screen.getByTestId(testId);
    expect(buttonElement).toHaveClass("bg-interactive-01");
  });

  it("should display the button with secondary style", () => {
    render(<Button text={mockLabel} style={ButtonType.SECONDARY} />);

    const buttonElement = screen.getByTestId(testId);
    expect(buttonElement).toHaveClass("bg-interactive-02");
  });

  it("should display the button disabled with secondary style", () => {
    const user = userEvent.setup();
    const onClickSpy = vi.fn();

    render(
      <Button
        text={mockLabel}
        style={ButtonType.SECONDARY}
        onClick={onClickSpy}
        disabled
      />
    );

    const buttonElement = screen.getByTestId(testId);   
    user.click(buttonElement);

    expect(onClickSpy).not.toBeCalled();
    expect(buttonElement).toHaveClass("bg-interactive-02");
  });

  it("should call the onClick event", () => {
    const onClickSpy = vi.fn();

    render(
      <Button
        text={mockLabel}
        style={ButtonType.SECONDARY}
        onClick={onClickSpy}
      />
    );

    const buttonElement = screen.getByTestId(testId);
    fireEvent.click(buttonElement);

    expect(onClickSpy).toBeCalled();
  });
});
