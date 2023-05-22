import { expect, afterEach, vi, beforeAll } from "vitest";

// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

// Mock svg's library to be able to run the tests
// To add more icons to the mock,
// add them into "__mocks__/@carbon/icons-react"
vi.mock("@carbon/icons-react");

// Run a cleanup after each test case (e.g. clearing jsdom)
import { cleanup } from "@testing-library/preact";

afterEach(() => {
  cleanup();
});
