// @vitest-environment jsdom

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/preact";
import userEvent from "@testing-library/user-event";

import { Dropdown } from "./Dropdown";

const mockLabel = "Dropdown";

const mockOptions = [
  {
    label: "dummy_1",
    value: "dummy_1",
  },
  {
    label: "dummy_2",
    value: "dummy_2",
  },
];

describe("Dropdown", () => {
  it("should display the dropdown component on the DOM", () => {
    render(
      <Dropdown
        label={mockLabel}
        options={mockOptions}
        handleOptionSelect={() => console.log("option changed")}
      />
    );

    const dropdownEl = screen.getByLabelText(mockLabel);
    expect(dropdownEl).toBeInTheDocument();
  });

  it("should show the dropdown options when the user clicks on the dropdown", () => {
    render(
      <Dropdown
        label={mockLabel}
        options={mockOptions}
        handleOptionSelect={() => console.log("option changed")}
      />
    );

    const dropdownEl = screen.getByLabelText(mockLabel);
    // click event provided by testing-library/preact
    fireEvent.click(dropdownEl);

    const list = screen.getByRole("listbox");
    expect(list).toBeVisible();
  });

  it("should return the value of the second item on the dropdown, when is selected and pressed 'enter' on the keyboard", async () => {
    const user = userEvent.setup();

    let elValue: string | null = null;
    const selectedOptionSpy = vi.fn((val) => (elValue = val));

    render(
      <Dropdown
        label={mockLabel}
        options={mockOptions}
        handleOptionSelect={(option) => selectedOptionSpy(option.value)}
      />
    );

    const dropdownEl = screen.getByLabelText(mockLabel);
    fireEvent.click(dropdownEl);

    const optionsList = screen.getAllByRole("option");
    optionsList[1].focus();

    await user.keyboard("[Enter]");

    expect(selectedOptionSpy).toBeCalledTimes(1);
    expect(elValue).toMatch(mockOptions[1].value);
  });

  it("should close the dropdown when the key esc is pressed", async () => {
    const user = userEvent.setup();
    const selectedOption = vi.fn();

    render(
      <Dropdown
        label={mockLabel}
        options={mockOptions}
        handleOptionSelect={(option) => selectedOption(option.value)}
      />
    );

    const dropdownEl = screen.getByLabelText(mockLabel);
    fireEvent.click(dropdownEl);

    const dropdownListEl = screen.getByRole("listbox");
    expect(dropdownListEl).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(dropdownListEl).not.toBeInTheDocument();
  });
});
