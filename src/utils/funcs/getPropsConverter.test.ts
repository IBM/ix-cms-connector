import { describe, it, expect } from "vitest";

import { getPropsConverter, canMapProps } from "./getPropsConverter";
import { TSType } from "../const";

describe("getPropsConverter()", () => {
  it("should return 'true' if we map 'string[]' to 'string[]'", () => {
    const result = getPropsConverter(
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

    expect(result).toBeTypeOf("function");
  });

  it("should return 'false' if we map 'string[]' to 'boolean[]'", () => {
    const result = getPropsConverter(
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

    expect(result).toBeUndefined();
  });

  it("should return a converter if we map 'boolean' to 'boolean[]'", () => {
    const result = getPropsConverter(
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
    const result = getPropsConverter(
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

    expect(result).toBeTypeOf("function");
  });

  it("should return a converter if we map 'number[]' (or any other type) to 'boolean'", () => {
    const result = getPropsConverter(
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
    const result = getPropsConverter(
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

    expect(result).toBeTypeOf("function");
  });

  it("should return a converter if we map 'string' to 'number'", () => {
    const result = getPropsConverter(
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
    const result = getPropsConverter(
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

    expect(result).toBeTypeOf("function");
  });

  it("should return a converter if we map 'boolean[]' (or any other type) to 'string'", () => {
    const result = getPropsConverter(
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
    const result = getPropsConverter(
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

    expect(result).toBeTypeOf("function");
  });

  it("should return 'true' if we map 'null' to 'null'", () => {
    const result = getPropsConverter(
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

    expect(result).toBeTypeOf("function");
  });

  it("should return a converter if we map 'null' to 'undefined'", () => {
    const result = getPropsConverter(
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
    const result = getPropsConverter(
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

describe("canMapProps()", () => {
  it("should return 'false' if we only a CMS mappable prop was provided", () => {
    const result = canMapProps({
      name: "fieldName",
      type: TSType.Array,
      subTypes: [TSType.String],
      isRequired: true,
    });

    expect(result).toBe(false);
  });
});
