import { describe, it, expect } from "vitest";

import {
  getComponentMappableProp,
  getComponentMappableProps,
} from "./getComponentMappableProps";
import { TSType } from "../const";
import type { Documentation } from "react-docgen";
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

describe("getComponentMappableProps()", () => {
  it("should have 2 mappable props if the given doc contains 2 valid and 1 invalid props", () => {
    const doc: Documentation = {
      props: {
        propUnion: {
          tsType: {
            name: "union",
            elements: [{ name: TSType.Number }, { name: TSType.Array }],
          },
          required: false,
        },
        propArray: {
          tsType: { name: TSType.Array, elements: [{ name: TSType.Number }] },
          required: false,
        },
        propString: {
          tsType: { name: TSType.String },
          required: false,
        },
      },
    };

    const result = getComponentMappableProps(doc);

    expect(result).toHaveLength(2);
  });
});

describe("getComponentMappableProps()", () => {
  it("should retrieve nested mappable props in case of 1 level of nesting", () => {
    const doc: Documentation = {
      props: {
        propObject: {
          required: true,
          tsType: {
            name: "signature",
            type: "object",
            signature: {
              properties: [
                {
                  key: "propString",
                  value: {
                    name: "string",
                    required: true,
                  },
                },
                {
                  key: "propBoolean",
                  value: {
                    name: "boolean",
                    required: true,
                  },
                },
              ],
            },
          },
        },
      },
    };

    const result = getComponentMappableProps(doc);

    expect(result).toHaveLength(2);
  });
});

describe("getComponentMappableProps()", () => {
  it("should retrieve nested mappable props in case of 1 level of nesting", () => {
    const doc: Documentation = {
      props: {
        propObject: {
          required: true,
          tsType: {
            name: "signature",
            type: "object",
            signature: {
              properties: [
                {
                  key: "propString",
                  value: {
                    name: "string",
                    required: true,
                  },
                },
                {
                  key: "propBoolean",
                  value: {
                    name: "boolean",
                    required: true,
                  },
                },
              ],
            },
          },
        },
      },
    };

    const result = getComponentMappableProps(doc);

    expect(result).toHaveLength(2);
  });
});

describe("getComponentMappableProps()", () => {
  it("should retrieve nested mappable props in case of 1 level of nesting", () => {
    const doc: Documentation = {
      props: {
        propObject: {
          required: true,
          tsType: {
            name: "signature",
            type: "object",
            signature: {
              properties: [
                {
                  key: "propObject",
                  value: {
                    name: "signature",
                    type: "object",
                    signature: {
                      properties: [
                        {
                          key: "propObject",
                          value: {
                            name: "signature",
                            type: "object",
                            signature: {
                              properties: [
                                {
                                  key: "propObject",
                                  value: {
                                    name: "signature",
                                    type: "object",
                                    signature: {
                                      properties: [
                                        {
                                          key: "propString",
                                          value: {
                                            name: "string",
                                            required: true,
                                          },
                                        },
                                        {
                                          key: "propBoolean",
                                          value: {
                                            name: "boolean",
                                            required: true,
                                          },
                                        },
                                      ],
                                    },
                                    required: true,
                                  },
                                },
                              ],
                            },
                            required: true,
                          },
                        },
                      ],
                    },
                    required: true,
                  },
                },
              ],
            },
          },
        },
      },
    };

    const result = getComponentMappableProps(doc);

    expect(result).toHaveLength(2);
  });
});
