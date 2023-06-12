/*
 * Copyright 2020- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
import { describe, it, expect } from "vitest";

import {
  getCmsMappableField,
  getCmsMappableFields,
} from "./getCmsMappableFields";
import { TSType } from "../const";
import { JSONSchema } from "../types";
import { CMSProvider } from "../../components/organisms/CmsSchemaForm";

describe("getCmsMappableField()", () => {
  it("should return 'undefined' if the given field schema is of an unsupported type", () => {
    const fieldName = "fieldName";
    const fieldSchema: JSONSchema = {
      type: "any",
    };

    const result = getCmsMappableField(fieldName, fieldSchema);

    expect(result).toBeUndefined();
  });

  it("should return a valid 'MappableProp' if the given field schema is of a primitive type", () => {
    const fieldName = "fieldName";
    const fieldSchema: JSONSchema = {
      type: "string",
    };

    const result = getCmsMappableField(fieldName, fieldSchema);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("name", fieldName);
    expect(result).toHaveProperty("type", TSType.String);
  });

  it("should return a valid 'MappableProp' if the given field schema is of a primitive array type", () => {
    const fieldName = "fieldName";
    const fieldSchema: JSONSchema = {
      type: "array",
      items: {
        type: "number",
      },
    };

    const result = getCmsMappableField(fieldName, fieldSchema);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("name", fieldName);
    expect(result).toHaveProperty("type", TSType.Array);
    expect(result).toHaveProperty("subTypes", [TSType.Number]);
  });

  it("should return 'undefined' if the given field schema is of a union type with an unsupported type", () => {
    const fieldName = "fieldName";
    const fieldSchema: JSONSchema = {
      type: ["number", "object"],
    };

    const result = getCmsMappableField(fieldName, fieldSchema);

    expect(result).toBeUndefined();
  });
});

describe("getCmsMappableFields()", () => {
  it("should have 2 mappable props if the given JSON schema contains 2 valid and 1 invalid props", () => {
    const schema: JSONSchema = {
      properties: {
        propUnion: {
          type: ["number", "object"],
        },
        propArray: {
          type: "array",
          items: {
            type: "number",
          },
        },
        propString: {
          type: "string",
        },
      },
    };

    const result = getCmsMappableFields(schema);

    expect(result).toHaveLength(2);
  });
});

describe("getCmsMappableFields()", () => {
  it("should retrieve mappable props in case of 1 level of nesting", () => {
    const schema: JSONSchema = {
      properties: {
        propObject: {
          type: "object",
          properties: {
            propString: {
              type: "string",
            },
            propBoolean: {
              type: "boolean",
            },
          },
        },
      },
    };

    const result = getCmsMappableFields(schema);

    expect(result).toHaveLength(2);
  });
});

describe("getCmsMappableFields()", () => {
  it("should retrieve mappable props in case of n levels of nesting", () => {
    const schema: JSONSchema = {
      properties: {
        propObject: {
          type: "object",
          properties: {
            propObject: {
              type: "object",
              properties: {
                propObject: {
                  type: "object",
                  properties: {
                    propObject: {
                      type: "object",
                      properties: {
                        propString: {
                          type: "string",
                        },
                        propBoolean: {
                          type: "boolean",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    };

    const result = getCmsMappableFields(schema);

    expect(result).toHaveLength(2);
  });
});

describe("getCmsMappableFields() for Magnolia", () => {
  it("should ignore mappable props prefixed with mgnl: and @", () => {
    const schema: JSONSchema = {
      properties: {
        propString: {
          type: "string",
        },
        "@propString": {
          type: "string",
        },
        "mgnl:propString": {
          type: "string",
        },
      },
    };

    const result = getCmsMappableFields(schema, CMSProvider.MAGNOLIA);

    expect(result).toHaveLength(1);
  });
});
