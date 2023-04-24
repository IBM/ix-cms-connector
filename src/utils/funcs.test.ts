import { isPrimitiveType } from "./funcs";

describe("utils/funcs", () => {

  describe("isPrimitiveType()", () => {
    it("should return 'true' if the given string matches a primitive type", () => {
      const typeString = "boolean";
      const result = isPrimitiveType(typeString);

      expect(result).toBeTruthy();
    });
  });
});