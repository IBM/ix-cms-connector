import { describe, it, expect, vi } from "vitest";

import toJsonSchema from "to-json-schema";
import {
  fetchData,
  getJSONSchema,
  getComponentMappableProp,
  getComponentMappableProps,
  getCMSMappableField,
  getCmsMappableFields,
  canMapProps,
  getCMSFieldPath,
  getMappablePropTypeSignature,
  generateAdapterCode,
} from "./funcs";
import { TSType } from "./const";
import { PropDescriptor } from "react-docgen/dist/Documentation";
import { ConverterFunc } from "./types";

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

describe("canMapProps()", () => {
  it("should return 'true' if we map 'string[]' to 'string[]'", () => {
    const result = canMapProps(
      {
        name: "fieldName",
        type: TSType.Array,
        subTypes: [TSType.String],
        isRequired: true,
      },
      {
        name: "propName",
        type: TSType.Array,
        subTypes: [TSType.String],
        isRequired: true,
      }
    );

    expect(result).toBeTruthy();
  });

  it("should return 'false' if we map 'string[]' to 'boolean[]'", () => {
    const result = canMapProps(
      {
        name: "fieldName",
        type: TSType.Array,
        subTypes: [TSType.String],
        isRequired: true,
      },
      {
        name: "propName",
        type: TSType.Array,
        subTypes: [TSType.Boolean],
        isRequired: true,
      }
    );

    expect(result).toBeFalsy();
  });

  it("should return a converter if we map 'boolean' to 'boolean[]'", () => {
    const result = canMapProps(
      {
        name: "fieldName",
        type: TSType.Boolean,
        isRequired: true,
      },
      {
        name: "propName",
        type: TSType.Array,
        subTypes: [TSType.Boolean],
        isRequired: true,
      }
    );

    expect(result).toBeTypeOf("function");
  });

  it("should return 'true' if we map 'boolean' to 'boolean'", () => {
    const result = canMapProps(
      {
        name: "fieldName",
        type: TSType.Boolean,
        isRequired: true,
      },
      {
        name: "propName",
        type: TSType.Boolean,
        isRequired: true,
      }
    );

    expect(result).toBeTruthy();
  });

  it("should return a converter if we map 'number[]' (or any other type) to 'boolean'", () => {
    const result = canMapProps(
      {
        name: "fieldName",
        type: TSType.Array,
        subTypes: [TSType.Number],
        isRequired: true,
      },
      {
        name: "propName",
        type: TSType.Boolean,
        isRequired: true,
      }
    );

    expect(result).toBeTypeOf("function");
  });

  it("should return 'true' if we map 'number' to 'number'", () => {
    const result = canMapProps(
      {
        name: "fieldName",
        type: TSType.Number,
        isRequired: true,
      },
      {
        name: "propName",
        type: TSType.Number,
        isRequired: true,
      }
    );

    expect(result).toBeTruthy();
  });

  it("should return a converter if we map 'string' to 'number'", () => {
    const result = canMapProps(
      {
        name: "fieldName",
        type: TSType.String,
        isRequired: true,
      },
      {
        name: "propName",
        type: TSType.Number,
        isRequired: true,
      }
    );

    expect(result).toBeTypeOf("function");
  });

  it("should return 'true' if we map 'string' to 'string'", () => {
    const result = canMapProps(
      {
        name: "fieldName",
        type: TSType.String,
        isRequired: true,
      },
      {
        name: "propName",
        type: TSType.String,
        isRequired: true,
      }
    );

    expect(result).toBeTruthy();
  });

  it("should return a converter if we map 'boolean[]' (or any other type) to 'string'", () => {
    const result = canMapProps(
      {
        name: "fieldName",
        type: TSType.Array,
        subTypes: [TSType.Boolean],
        isRequired: true,
      },
      {
        name: "propName",
        type: TSType.String,
        isRequired: true,
      }
    );

    expect(result).toBeTypeOf("function");
  });

  it("should return 'true' if we map 'number' to 'union' that has 'number'", () => {
    const result = canMapProps(
      {
        name: "fieldName",
        type: TSType.Number,
        isRequired: true,
      },
      {
        name: "propName",
        type: TSType.Union,
        subTypes: [TSType.String, TSType.Number, TSType.Null],
        isRequired: true,
      }
    );

    expect(result).toBeTruthy();
  });

  it("should return 'true' if we map 'null' to 'null'", () => {
    const result = canMapProps(
      {
        name: "fieldName",
        type: TSType.Null,
        isRequired: true,
      },
      {
        name: "propName",
        type: TSType.Null,
        isRequired: true,
      }
    );

    expect(result).toBeTruthy();
  });

  it("should return a converter if we map 'null' to 'undefined'", () => {
    const result = canMapProps(
      {
        name: "fieldName",
        type: TSType.Null,
        isRequired: true,
      },
      {
        name: "propName",
        type: TSType.Undefined,
        isRequired: true,
      }
    );

    expect(result).toBeTypeOf("function");
  });

  it("should return a converter if we map 'null' to a not required prop (of any type)", () => {
    const result = canMapProps(
      {
        name: "fieldName",
        type: TSType.Null,
        isRequired: true,
      },
      {
        name: "propName",
        type: TSType.String,
        isRequired: false,
      }
    );

    expect(result).toBeTypeOf("function");
  });
});
