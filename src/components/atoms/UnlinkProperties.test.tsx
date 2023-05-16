// @vitest-environment jsdom

import { it, expect, describe, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/preact";

import { UnlinkProperties } from "./UnlinkProperties";

describe("UnlinkProperties", () => {
  it("should display an UnlinkProperties Component", () => {
    const clickSpy = vi.fn();
    render(<UnlinkProperties onClick={clickSpy} />);

    const buttonEl = screen.getByRole("button");

    expect(buttonEl).toBeInTheDocument();
  });

  it("should invoke onClick when clicked", () => {
    const clickSpy = vi.fn();
    render(<UnlinkProperties onClick={clickSpy} />);

    const buttonEl = screen.getByRole("button");

    fireEvent.click(buttonEl);

    expect(clickSpy).toBeCalled();
  });
});
