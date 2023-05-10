// @vitest-environment jsdom

import { it, expect, describe, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/preact";
import userEvent from "@testing-library/user-event";

import { RadioButton } from "./RadioButton";

const testId1 = "test-1";
const testId2 = "test-2";
const testId3 = "test-3";
const label1 = "test-label";
const label2 = "test-label 2";
const group = "test-group";

beforeEach(() => {
  render(
    <>
      <RadioButton name={group} id={testId1} testId={testId1} label={label1} />
      <RadioButton name={group} id={testId2} testId={testId2} label={label2} />
      <RadioButton name={group} id={testId3} testId={testId3} />
    </>
  );
});

describe("RadioButton", () => {
  it("should display a radio button", () => {
    const radioButtonEl = screen.getByTestId(testId1);
    expect(radioButtonEl).toBeInTheDocument();
  });

  it("should be 'checked' if clicked", () => {
    const radioButtonEl = screen.getByTestId(testId1);
    fireEvent.click(radioButtonEl);
    expect(radioButtonEl).toBeChecked();
  });

  it("should be 'checked' if the label was clicked", () => {
    const radioButtonEl = screen.getByTestId(testId1);
    const radioButtonLabel = screen.getByTestId(`${testId1}-label`);
    fireEvent.click(radioButtonLabel);
    expect(radioButtonEl).toBeChecked();
  });

  it("should be 'unchecked' if another radio button of the same group was clicked", () => {
    const firstEl = screen.getByTestId(testId1);
    const secondEl = screen.getByTestId(testId2);
    fireEvent.click(firstEl);
    expect(firstEl).toBeChecked();
    fireEvent.click(secondEl);
    expect(firstEl).not.toBeChecked();
    expect(secondEl).toBeChecked();
  });

  it("should not render a label if the label prop is 'undefined'", () => {
    const radioButtonLabel = screen.queryByTestId(`${testId3}-label`);
    expect(radioButtonLabel).toBeNull();
  });

  it("should be 'checked' if the radio button was checked by keyboard using the 'space' key", async () => {
    const user = userEvent.setup();
    const radioButtonEl = screen.getByTestId(testId1);
    radioButtonEl.focus();
    await user.keyboard(" ");
    expect(radioButtonEl).toBeChecked();
  });
});
