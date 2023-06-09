/*
 * Copyright 2020- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
import { describe, it, expect } from "vitest";

import { getPropsConverter, canMapProps } from "./getPropsConverter";
import { TSType } from "../const";

describe("getPropsConverter()", () => {
  it("should return a dummy-converter if we map 'string[]' to 'string[]'", () => {
    const cmsField = {
      name: "fieldName",
      type: TSType.Array,
      subTypes: [TSType.String],
      isRequired: true,
    };
    const componentProp = {
      name: "propName",
      type: TSType.Array,
      subTypes: [TSType.String],
      isRequired: true,
    };

    const converter = getPropsConverter(cmsField, componentProp);
    const result = converter(cmsField.name);

    expect(converter).toBeTypeOf("function");
    expect(result).toBe(cmsField.name);
  });

  it("should not return a converter if we map 'string[]' to 'boolean[]'", () => {
    const cmsField = {
      name: "fieldName",
      type: TSType.Array,
      subTypes: [TSType.String],
      isRequired: true,
    };
    const componentProp = {
      name: "propName",
      type: TSType.Array,
      subTypes: [TSType.Boolean],
      isRequired: true,
    };

    const converter = getPropsConverter(cmsField, componentProp);

    expect(converter).toBeUndefined();
  });

  it("should return a converter if we map 'boolean' to 'boolean[]'", () => {
    const cmsField = {
      name: "fieldName",
      type: TSType.Boolean,
      isRequired: true,
    };
    const componentProp = {
      name: "propName",
      type: TSType.Array,
      subTypes: [TSType.Boolean],
      isRequired: true,
    };

    const converter = getPropsConverter(cmsField, componentProp);
    const result = converter(cmsField.name);

    expect(converter).toBeTypeOf("function");
    expect(result).not.toBe(cmsField.name);
  });

  it("should return a dummy-converter if we map 'boolean' to 'boolean'", () => {
    const cmsField = {
      name: "fieldName",
      type: TSType.Boolean,
      isRequired: true,
    };
    const componentProp = {
      name: "propName",
      type: TSType.Boolean,
      isRequired: true,
    };

    const converter = getPropsConverter(cmsField, componentProp);
    const result = converter(cmsField.name);

    expect(converter).toBeTypeOf("function");
    expect(result).toBe(cmsField.name);
  });

  it("should return a converter if we map 'number[]' (or any other type) to 'boolean'", () => {
    const cmsField = {
      name: "fieldName",
      type: TSType.Array,
      subTypes: [TSType.Number],
      isRequired: true,
    };
    const componentProp = {
      name: "propName",
      type: TSType.Boolean,
      isRequired: true,
    };

    const converter = getPropsConverter(cmsField, componentProp);
    const result = converter(cmsField.name);

    expect(converter).toBeTypeOf("function");
    expect(result).not.toBe(cmsField.name);
  });

  it("should return a dummy-converter if we map 'number' to 'number'", () => {
    const cmsField = {
      name: "fieldName",
      type: TSType.Number,
      isRequired: true,
    };
    const componentProp = {
      name: "propName",
      type: TSType.Number,
      isRequired: true,
    };

    const converter = getPropsConverter(cmsField, componentProp);
    const result = converter(cmsField.name);

    expect(converter).toBeTypeOf("function");
    expect(result).toBe(cmsField.name);
  });

  it("should return a converter if we map 'string' to 'number'", () => {
    const cmsField = {
      name: "fieldName",
      type: TSType.String,
      isRequired: true,
    };
    const componentProp = {
      name: "propName",
      type: TSType.Number,
      isRequired: true,
    };

    const converter = getPropsConverter(cmsField, componentProp);
    const result = converter(cmsField.name);

    expect(converter).toBeTypeOf("function");
    expect(result).not.toBe(cmsField.name);
  });

  it("should return a dummy-converter if we map 'string' to 'string'", () => {
    const cmsField = {
      name: "fieldName",
      type: TSType.String,
      isRequired: true,
    };
    const componentProp = {
      name: "propName",
      type: TSType.String,
      isRequired: true,
    };

    const converter = getPropsConverter(cmsField, componentProp);
    const result = converter(cmsField.name);

    expect(converter).toBeTypeOf("function");
    expect(result).toBe(cmsField.name);
  });

  it("should return a converter if we map 'boolean[]' (or any other type) to 'string'", () => {
    const cmsField = {
      name: "fieldName",
      type: TSType.Array,
      subTypes: [TSType.Boolean],
      isRequired: true,
    };
    const componentProp = {
      name: "propName",
      type: TSType.String,
      isRequired: true,
    };

    const converter = getPropsConverter(cmsField, componentProp);
    const result = converter(cmsField.name);

    expect(converter).toBeTypeOf("function");
    expect(result).not.toBe(cmsField.name);
  });

  it("should return a dummy-converter if we map 'number' to 'union' that has 'number'", () => {
    const cmsField = {
      name: "fieldName",
      type: TSType.Number,
      isRequired: true,
    };
    const componentProp = {
      name: "propName",
      type: TSType.Union,
      subTypes: [TSType.String, TSType.Number, TSType.Null],
      isRequired: true,
    };

    const converter = getPropsConverter(cmsField, componentProp);
    const result = converter(cmsField.name);

    expect(converter).toBeTypeOf("function");
    expect(result).toBe(cmsField.name);
  });

  it("should return a dummy-converter if we map 'null' to 'null'", () => {
    const cmsField = {
      name: "fieldName",
      type: TSType.Null,
      isRequired: true,
    };
    const componentProp = {
      name: "propName",
      type: TSType.Null,
      isRequired: true,
    };

    const converter = getPropsConverter(cmsField, componentProp);
    const result = converter(cmsField.name);

    expect(converter).toBeTypeOf("function");
    expect(result).toBe(cmsField.name);
  });

  it("should return a converter if we map 'null' to 'undefined'", () => {
    const cmsField = {
      name: "fieldName",
      type: TSType.Null,
      isRequired: true,
    };
    const componentProp = {
      name: "propName",
      type: TSType.Undefined,
      isRequired: true,
    };

    const converter = getPropsConverter(cmsField, componentProp);
    const result = converter(cmsField.name);

    expect(converter).toBeTypeOf("function");
    expect(result).not.toBe(cmsField.name);
  });

  it("should return a converter if we map 'null' to a not required prop (of any type)", () => {
    const cmsField = {
      name: "fieldName",
      type: TSType.Null,
      isRequired: true,
    };
    const componentProp = {
      name: "propName",
      type: TSType.String,
      isRequired: false,
    };

    const converter = getPropsConverter(cmsField, componentProp);
    const result = converter(cmsField.name);

    expect(converter).toBeTypeOf("function");
    expect(result).not.toBe(cmsField.name);
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
