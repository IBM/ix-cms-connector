import { getCMSFieldType, canMapProps } from "./funcs";

describe("utils/funcs", () => {
  describe("getCMSFieldType()", () => {
    it("should return 'number' if the given type equals 'number' or 'integer'", () => {
      const result = getCMSFieldType({ type: "integer" });

      expect(result).toBe("number");
    });
  });

  describe("canMapProps()", () => {
    it("should return 'true' if the given types are the same", () => {
      const result = canMapProps(
        {
          name: "items",
          type: "string[]",
          isRequired: false,
        },
        {
          name: "itemsList",
          type: "string[]",
          isRequired: true,
        }
      );

      expect(result).toBeTruthy();
    });

    it("should return 'true' if the given types can be converted", () => {
      const result = canMapProps(
        {
          name: "name",
          type: "string",
          isRequired: false,
        },
        {
          name: "hasName",
          type: "boolean",
          isRequired: true,
        }
      );

      expect(result).toBeTruthy();
    });

    it("should return 'false' if the given types can't be mapped", () => {
      const result = canMapProps(
        {
          name: "name",
          type: "string",
          isRequired: false,
        },
        {
          name: "flags",
          type: "boolean[]",
          isRequired: false,
        }
      );

      expect(result).toBeFalsy();
    });
  });
});
