import { describe, it, expect } from "vitest";
import { isPrimitiveType } from "./funcs";

describe("isPrimitiveType()", () => {
  it("should return 'true' if the given string matches a primitive type", () => {
    const typeString = "boolean";
    const result = isPrimitiveType(typeString);

    expect(result).toBeTruthy();
  });
});
