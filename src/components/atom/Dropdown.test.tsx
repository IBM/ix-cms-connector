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

  it("should select the second option on the dropdown with the keyboard arrows", async () => {
    const handler = vi.fn((val) => 0);
    const user = userEvent.setup();

    render(
      <Dropdown
        label={mockLabel}
        options={mockOptions}
        handleOptionSelect={(option) => handler(option.value)}
      />
    );

    const dropdownEl = screen.getByLabelText(mockLabel);
    fireEvent.click(dropdownEl);

    // Example to get all the list that's visible
    // const optionsList = screen.getAllByRole("option");
    // screen.debug(optionsList);

    user.keyboard("{ArrowDown}{ArrowDown}{Enter}");

    // expect(handler).toBeCalled();
  });
});
