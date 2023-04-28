import { getCMSMappableFieldType } from "./funcs";

describe("utils/funcs", () => {
  describe("getCMSMappableFieldType()", () => {
    it("should return 'number' if the given type equals 'number' or 'integer'", () => {
      const result = getCMSMappableFieldType({ type: "integer" });

      expect(result).toBe("number");
    });
  });
});
