import { describe, it, expect } from "vitest";

import type { Documentation } from "react-docgen";
import {
  getCMSFieldPath,
  getMappablePropTypeSignature,
  generateAdapterCode,
} from "./generateAdapterCode";
import { TSType } from "../const";
import { MappableProp } from "../types";

import { transpile, JsxEmit, ModuleKind, ScriptTarget } from "typescript";
import { SampleComponent } from "../../../samples/adaptor/SampleComponent";

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

describe("generateAdapterCode()", () => {
  it("should return a generated HOC", () => {
    const componentDoc: Documentation = {
      displayName: "MyComponent",
    };

    const mappedProps1: [MappableProp, MappableProp] = [
      {
        name: "title",
        type: TSType.Null,
        isRequired: true,
      },
      {
        name: "header",
        type: TSType.String,
        isRequired: false,
      },
    ];

    const mappedProps2: [MappableProp, MappableProp] = [
      {
        name: "count",
        type: TSType.String,
        isRequired: true,
      },
      {
        name: "count",
        type: TSType.Number,
        isRequired: false,
      },
    ];

    const result = generateAdapterCode(componentDoc, [
      mappedProps1,
      mappedProps2,
    ]);

    expect(result).toContain(
      `function connect${componentDoc.displayName}ToCMS`
    );
    expect(result).toContain(
      `${mappedProps1[1].name}: cmsData.${mappedProps1[0].name} ?? undefined`
    );
    expect(result).toContain(
      `${mappedProps2[1].name}: Number(cmsData.${mappedProps2[0].name})`
    );
  });
});

describe("generateAdapterCode()", () => {
  it("should return a generated HOC", () => {
    const componentDoc: Documentation = {
      displayName: "MyComponent",
      props: {
        test: {
          tsType: {
            name: "string",
          },
        },
      },
    };

    const mappedProps1: [MappableProp, MappableProp] = [
      {
        name: "title",
        type: TSType.Null,
        isRequired: true,
      },
      {
        name: "header",
        type: TSType.String,
        isRequired: false,
      },
    ];

    const mappedProps2: [MappableProp, MappableProp] = [
      {
        name: "count",
        type: TSType.String,
        isRequired: true,
      },
      {
        name: "count",
        type: TSType.Number,
        isRequired: false,
      },
    ];

    const result = generateAdapterCode(componentDoc, [
      mappedProps1,
      mappedProps2,
    ]);

    let jsCode = transpile(result, {
      // esModuleInterop: true,
      module: ModuleKind.ES2022,
      // target: ScriptTarget.ES5,
      jsx: JsxEmit.ReactJSX,
      jsxImportSource: "preact",
      skipLibCheck: true,
      baseUrl: "./",
      paths: {
        react: ["./node_modules/preact/compat/"],
        "react-dom": ["./node_modules/preact/compat/"],
      },
      lib: ["dom.iterable"],
    });

    console.log("js: " + jsCode);

    const dataUri =
      "data:text/javascript;charset=utf-8," + encodeURIComponent(jsCode);

    import(dataUri)
      .then((module) => {
        const { connectMyComponentToCMS } = module;

        const ConnectedComponent = connectMyComponentToCMS({
          title: null,
          count: "2",
        })(SampleComponent);

        console.log(JSON.stringify(ConnectedComponent()));
      })
      .catch((err) => console.log(err));
  });
});
