import { describe, it, expect, vi } from "vitest";

import toJsonSchema from "to-json-schema";
import {
  fetchData,
  getJSONSchema,
  getComponentMappableProp,
  canMapProps,
} from "./funcs";
import { TSType } from "./const";
import { PropDescriptor } from "react-docgen/dist/Documentation";

// Mocks a module (gets hoisted at the beginning of the file)
// It's functionality can be mocked under the folder "__mocks__"
// to make it available to all the tests globally
vi.mock("axios");
vi.mock("to-json-schema");

// Will be reused in the tests (it can be set individually)
const testEndpoint = "https://dummyjson.com/products/1";

describe("fetchData()", () => {
  it("should return any data available for the endpoint", async () => {
    const result = await fetchData(testEndpoint);
    expect(result).toBeDefined();
  });
});

describe("getJSONSchema()", () => {
  it("should execute the jsonSchemaGenerator method", async () => {
    await getJSONSchema(testEndpoint);

    // Check that the mocked module was called
    expect(toJsonSchema).toBeCalled();
  });

  it("should return a promise that resolves to a defined value", () => {
    // resets the mocks, so we can use the real module
    vi.restoreAllMocks();

    // "return" and "resolve" is a way of handling a promise
    return expect(getJSONSchema(testEndpoint)).resolves.toBeDefined();
  });
});

describe("getComponentMappableProp()", () => {
  it("should return 'undefined' if the given prop description is of an unsupported type", () => {
    const propName = "descr";
    const propDescr: PropDescriptor = {
      type: { name: "any" },
      required: false,
    };

    const result = getComponentMappableProp(propName, propDescr);

    expect(result).toBeUndefined();
  });

  it("should return a valid 'MappableProp' if the given prop description is of a primitive type", () => {
    const propName = "descr";
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
    const propName = "items";
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
    const propName = "isValid";
    const propDescr: PropDescriptor = {
      type: { name: "union", value: [{ name: "bool" }, { name: "func" }] },
      required: false,
    };

    const result = getComponentMappableProp(propName, propDescr);

    expect(result).toBeUndefined();
  });
});

// describe("canMapProps()", () => {
//   it("should return 'true' if the given types are the same", () => {
//     const result = canMapProps(
//       {
//         name: "items",
//         type: CommonType.StringArray,
//         isRequired: false,
//       },
//       {
//         name: "itemsList",
//         type: CommonType.StringArray,
//         isRequired: true,
//       }
//     );

//     expect(result).toBeTruthy();
//   });

//   it("should return 'true' if the given types can be converted", () => {
//     const result = canMapProps(
//       {
//         name: "name",
//         type: CommonType.String,
//         isRequired: false,
//       },
//       {
//         name: "hasName",
//         type: CommonType.Boolean,
//         isRequired: true,
//       }
//     );

//     expect(result).toBeTruthy();
//   });

//   it("should return 'false' if the given types can't be mapped", () => {
//     const result = canMapProps(
//       {
//         name: "name",
//         type: CommonType.String,
//         isRequired: false,
//       },
//       {
//         name: "flags",
//         type: CommonType.BooleanArray,
//         isRequired: false,
//       }
//     );

//     expect(result).toBeFalsy();
//   });
// });
