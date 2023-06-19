import { describe, it, expect } from "vitest";
import type { Documentation } from "react-docgen";
import CodeBlockWriter from "code-block-writer";
import {
  getCMSFieldPath,
  getMappablePropTypeSignature,
  getPropsTree,
  writeMappedPropsInterface,
  writeRestPropsInterface,
  writeMappedPropsObjectBody,
} from "./generatorUtils";
import { TSType, PropSource } from "../const";
import { MappableProp, MappedProps, TreeProp } from "../types";

describe("getCMSFieldPath()", () => {
  it("should return 'cmsData.name' (no conversion) if the given props are of the same type", () => {
    const cmsField: MappableProp = {
      name: "name",
      type: TSType.String,
      isRequired: true,
    };

    const componentProp: MappableProp = {
      name: "title",
      type: TSType.String,
      isRequired: true,
    };

    const result = getCMSFieldPath(cmsField, componentProp);

    expect(result).toBe(`cmsData.${cmsField.name}`);
  });

  it("should return 'Number(cmsData.count)' (a conversion) if the given props should be converted from 'string' to 'number'", () => {
    const cmsField: MappableProp = {
      name: "count",
      type: TSType.String,
      isRequired: true,
    };

    const componentProp: MappableProp = {
      name: "length",
      type: TSType.Number,
      isRequired: true,
    };

    const result = getCMSFieldPath(cmsField, componentProp);

    expect(result).toBe(`Number(cmsData.${cmsField.name})`);
  });
});

describe("getMappablePropTypeSignature()", () => {
  it("should return 'number' if the given MappableProp is of the number type", () => {
    const mappableProp: MappableProp = {
      name: "name",
      type: TSType.Number,
      isRequired: true,
    };

    const result = getMappablePropTypeSignature(mappableProp);

    expect(result).toBe("number");
  });

  it("should return 'string[]' if the given MappableProp is an array of strings", () => {
    const mappableProp: MappableProp = {
      name: "name",
      type: TSType.Array,
      subTypes: [TSType.String],
      isRequired: true,
    };

    const result = getMappablePropTypeSignature(mappableProp);

    expect(result).toBe("string[]");
  });

  it("should return 'string | null | undefined' if the given MappableProp is of the union (string or null or undefined) type", () => {
    const mappableProp: MappableProp = {
      name: "name",
      type: TSType.Union,
      subTypes: [TSType.String, TSType.Null, TSType.Undefined],
      isRequired: true,
    };

    const result = getMappablePropTypeSignature(mappableProp);

    expect(result).toBe("string | null | undefined");
  });
});

describe("getPropsTree()", () => {
  it("should return an empty array when no props are passed in", () => {
    const result = getPropsTree(PropSource.CMS, []);

    expect(result).toEqual([]);
  });

  it("should return a single level tree when all the passed in props are not nested", () => {
    const mappedProps: MappedProps = [
      [
        { name: "propCms", type: TSType.Number, isRequired: true },
        { name: "propComp", type: TSType.String, isRequired: true },
      ],
    ];

    const result = getPropsTree(PropSource.CMS, mappedProps);

    expect(result).toEqual([{ name: "propCms", mappedPair: mappedProps[0] }]);
  });

  it("should return a valid props tree for given mapped props array", () => {
    const mappedProps: MappedProps = [
      [
        { name: "propCms1.subPropCms1", type: TSType.String, isRequired: true },
        { name: "propComp1", type: TSType.String, isRequired: true },
      ],
      [
        {
          name: "propCms1.subPropCms2.subSubPropCms1",
          type: TSType.Number,
          isRequired: false,
        },
        {
          name: "propComp2.subPropComp1",
          type: TSType.Number,
          isRequired: false,
        },
      ],
      [
        {
          name: "propCms1.subPropCms2.subSubPropCms2",
          type: TSType.Number,
          isRequired: false,
        },
        {
          name: "propComp3",
          type: TSType.Number,
          isRequired: false,
        },
      ],
      [
        {
          name: "propCms2",
          type: TSType.Number,
          isRequired: false,
        },
        {
          name: "propComp2.subPropComp2",
          type: TSType.Number,
          isRequired: false,
        },
      ],
    ];

    const result = getPropsTree(PropSource.CMS, mappedProps);

    expect(result).toEqual([
      {
        name: "propCms1",
        props: [
          {
            name: "subPropCms1",
            mappedPair: mappedProps[0],
          },
          {
            name: "subPropCms2",
            props: [
              {
                name: "subSubPropCms1",
                mappedPair: mappedProps[1],
              },
              {
                name: "subSubPropCms2",
                mappedPair: mappedProps[2],
              },
            ],
          },
        ],
      },
      {
        name: "propCms2",
        mappedPair: mappedProps[3],
      },
    ]);
  });
});

describe("writeMappedPropsInterface()", () => {
  it("should write the correct interface body for a single prop", () => {
    const writer = new CodeBlockWriter();

    const propsTree: TreeProp[] = [
      {
        name: "names",
        mappedPair: [
          {
            name: "names",
            type: TSType.Array,
            subTypes: [TSType.String],
            isRequired: true,
          },
          {
            name: "names",
            type: TSType.Array,
            subTypes: [TSType.String],
            isRequired: false,
          },
        ],
      },
    ];

    writeMappedPropsInterface(writer, PropSource.CMS, propsTree);

    expect(writer.toString()).to.equal("names: string[];\n");
  });

  it("should write the correct interface for deep nested props", () => {
    const writer = new CodeBlockWriter({ indentNumberOfSpaces: 2 });
    const propsTree: TreeProp[] = [
      {
        name: "user",
        props: [
          {
            name: "name",
            mappedPair: [
              {
                name: "name",
                type: TSType.String,
                isRequired: true,
              },
              {
                name: "name",
                type: TSType.String,
                isRequired: false,
              },
            ],
          },
          {
            name: "age",
            mappedPair: [
              {
                name: "age",
                type: TSType.Number,
                isRequired: true,
              },
              {
                name: "age",
                type: TSType.Number,
                isRequired: false,
              },
            ],
          },
          {
            name: "address",
            props: [
              {
                name: "street",
                mappedPair: [
                  {
                    name: "street",
                    type: TSType.String,
                    isRequired: true,
                  },
                  {
                    name: "street",
                    type: TSType.String,
                    isRequired: false,
                  },
                ],
              },
              {
                name: "city",
                mappedPair: [
                  {
                    name: "city",
                    type: TSType.String,
                    isRequired: true,
                  },
                  {
                    name: "city",
                    type: TSType.String,
                    isRequired: false,
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    writeMappedPropsInterface(writer, PropSource.CMS, propsTree);

    expect(writer.toString()).to.equal(
      "user: {\n  name: string;\n  age: number;\n  address: {\n    street: string;\n    city: string;\n  };\n};\n"
    );
  });
});

describe("writeRestPropsInterface()", () => {
  it("should write the correct 'rest props' interface for a given component and its mapped props", () => {
    const writer = new CodeBlockWriter({ indentNumberOfSpaces: 2 });

    const componentDoc: Documentation = {
      props: {
        prop1: {
          required: true,
          tsType: {
            name: "string",
          },
        },
        prop2: {
          required: false,
          tsType: {
            name: "signature",
            type: "object",
            signature: {
              properties: [
                {
                  key: "prop3",
                  value: {
                    name: "number",
                    required: true,
                  },
                },
                {
                  key: "prop4",
                  value: {
                    name: "boolean",
                  },
                },
              ],
            },
          },
        },
      },
    };

    const compMappedPropsTree: TreeProp[] = [
      {
        name: "prop2",
        props: [
          {
            name: "prop3",
          },
        ],
      },
    ];

    writeRestPropsInterface(writer, componentDoc, compMappedPropsTree);

    expect(writer.toString()).to.equal(
      "prop1: string;\nprop2?: {\n  prop4?: boolean;\n};\n"
    );
  });
});

describe("writeMappedPropsObjectBody()", () => {
  it("should write the correct 'all props' object body for a given props tree", () => {
    const writer = new CodeBlockWriter({ indentNumberOfSpaces: 2 });

    const compPropsTree: TreeProp[] = [
      {
        name: "prop1",
        mappedPair: [
          { name: "field1", type: TSType.String, isRequired: true },
          { name: "prop1", type: TSType.Number, isRequired: false },
        ],
      },
      {
        name: "prop2",
        props: [
          {
            name: "prop3",
            mappedPair: [
              { name: "field2.field3", type: TSType.Null, isRequired: true },
              { name: "prop3", type: TSType.Boolean, isRequired: true },
            ],
          },
        ],
      },
    ];

    writeMappedPropsObjectBody(writer, compPropsTree, []);

    expect(writer.toString()).to.equal(
      "...restProps,\nprop1: Number(cmsData.field1),\nprop2: {\n  ...restProps.prop2,\n  prop3: !!cmsData.field2.field3,\n},\n"
    );
  });
});
