// @vitest-environment jsdom

import { it, expect, describe, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/preact";
import userEvent from "@testing-library/user-event";

import { RadioButton } from "./RadioButton";

const label1 = "test-label 1";
const label2 = "test-label 2";
const group = "test-group";

beforeEach(() => {
  render(
    <>
      <RadioButton name={group} label={label1} />
      <RadioButton name={group} label={label2} />
    </>
  );
});

describe("RadioButton", () => {
  it("should display a radio button", () => {
    const radioButtonEl = screen.getByLabelText(label1);

    expect(radioButtonEl).toBeInTheDocument();
  });

  it("should be 'checked' if clicked", () => {
    const radioButtonEl = screen.getByLabelText(label1);

    fireEvent.click(radioButtonEl);

    expect(radioButtonEl).toBeChecked();
  });

  it("should be 'checked' if the label was clicked", () => {
    const radioButtonEl = screen.getByLabelText(label1);
    const radioButtonLabel = screen.getByText(label1);

    fireEvent.click(radioButtonLabel);

    expect(radioButtonEl).toBeChecked();
  });

  it("should be 'checked' if the radio button was checked by keyboard using the 'space' key", async () => {
    const user = userEvent.setup();
    const radioButtonEl = screen.getByLabelText(label1);

    radioButtonEl.focus();
    await user.keyboard(" ");

    expect(radioButtonEl).toBeChecked();
  });

  it("should be 'unchecked' if another radio button of the same group was clicked", () => {
    const firstEl = screen.getByLabelText(label1);
    const secondEl = screen.getByLabelText(label2);

    fireEvent.click(firstEl);
    fireEvent.click(secondEl);

    expect(firstEl).not.toBeChecked();
    expect(secondEl).toBeChecked();
  });
});
