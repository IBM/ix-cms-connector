import { getCMSFieldType } from "./funcs";

describe("utils/funcs", () => {
  describe("getCMSFieldType()", () => {
    it("should return 'number' if the given type equals 'number' or 'integer'", () => {
      const result = getCMSFieldType({ type: "integer" });

      expect(result).toBe("number");
    });
  });
});
