import { describe, it, expect } from "vitest";

import { getCMSFieldType, canMapProps } from "./funcs";
import { CommonType } from "./const";

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
          type: CommonType.StringArray,
          isRequired: false,
        },
        {
          name: "itemsList",
          type: CommonType.StringArray,
          isRequired: true,
        }
      );

      expect(result).toBeTruthy();
    });

    it("should return 'true' if the given types can be converted", () => {
      const result = canMapProps(
        {
          name: "name",
          type: CommonType.String,
          isRequired: false,
        },
        {
          name: "hasName",
          type: CommonType.Boolean,
          isRequired: true,
        }
      );

      expect(result).toBeTruthy();
    });

    it("should return 'false' if the given types can't be mapped", () => {
      const result = canMapProps(
        {
          name: "name",
          type: CommonType.String,
          isRequired: false,
        },
        {
          name: "flags",
          type: CommonType.BooleanArray,
          isRequired: false,
        }
      );

      expect(result).toBeFalsy();
    });
  });
});
