import { describe, it, expect } from "vitest";

import {
  getComponentMappableProp,
  getComponentMappableProps,
} from "./getComponentMappableProps";
import { TSType } from "../const";
import { PropDescriptor } from "react-docgen/dist/Documentation";

describe("getComponentMappableProp()", () => {
  it("should return 'undefined' if the given prop description is of an unsupported type", () => {
    const propName = "propName";
    const propDescr: PropDescriptor = {
      type: { name: "any" },
      required: false,
    };

    const result = getComponentMappableProp(propName, propDescr);

    expect(result).toBeUndefined();
  });

  it("should return a valid 'MappableProp' if the given prop description is of a primitive type", () => {
    const propName = "propName";
    const propDescr: PropDescriptor = {
      tsType: { name: TSType.String },
      required: false,
    };

    const result = getComponentMappableProp(propName, propDescr);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("name", propName);
    expect(result).toHaveProperty("type", TSType.String);
  });

  it("should return a valid 'MappableProp' if the given prop description is of a primitive array type", () => {
    const propName = "propName";
    const propDescr: PropDescriptor = {
      tsType: { name: TSType.Array, elements: [{ name: TSType.Number }] },
      required: false,
    };

    const result = getComponentMappableProp(propName, propDescr);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("name", propName);
    expect(result).toHaveProperty("type", TSType.Array);
    expect(result).toHaveProperty("subTypes", [TSType.Number]);
  });

  it("should return 'undefined' if the given prop description is of a union type with an unsupported type", () => {
    const propName = "propName";
    const propDescr: PropDescriptor = {
      type: { name: "union", value: [{ name: "bool" }, { name: "func" }] },
      required: false,
    };

    const result = getComponentMappableProp(propName, propDescr);

    expect(result).toBeUndefined();
  });
});
