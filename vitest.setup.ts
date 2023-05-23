import { expect, afterEach, vi } from "vitest";

// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import matchers from "@testing-library/jest-dom/matchers";

// Run a cleanup after each test case (e.g. clearing jsdom)
import { cleanup } from "@testing-library/preact";

expect.extend(matchers);

// Mock svg's library to be able to run the tests
// To add more icons to the mock,
// add them into "__mocks__/@carbon/icons-react"
vi.mock("@carbon/icons-react");

vi.mock("generatedAdapter");

afterEach(() => {
  cleanup();
});
