// @vitest-environment jsdom

import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/preact";

import { Error } from "./Error";

const errorMSG = "Error test";

beforeEach(() => {
  render(
    <Error>
      <p aria-label="error-msg">{errorMSG}</p>
    </Error>
  );
});

describe("Error", () => {
  it("should display Error component", () => {
    const errorEl = screen.getByLabelText("error");
    expect(errorEl).toBeInTheDocument();
  });

  it("should display children in Error component", () => {
    const childrenEl = screen.getByLabelText("error-msg");
    expect(childrenEl).toBeInTheDocument();
  });
});
