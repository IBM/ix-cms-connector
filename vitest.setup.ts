import { expect, afterEach } from "vitest";

// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

//run a cleanup after each test case (e.g. clearing jsdom)
import { cleanup } from "@testing-library/preact";

afterEach(() => {
  cleanup();
});
