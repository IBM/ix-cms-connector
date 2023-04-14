import type { Documentation, Config } from "react-docgen";
import type { MappableProp } from "./types";
import { JSONSchema4, JSONSchema4TypeName } from "json-schema";

export function getComponentParserConfig(fileName: string): Config {
  const fileExt = fileName.split(".").pop().toLowerCase();

  // taken from the official repo, see https://github.com/reactjs/react-docgen/blob/main/packages/website/src/components/playground/Playground.tsx
  const defaultParserPlugins = [
    "jsx",
    "asyncDoExpressions",
    "decimal",
    "decorators",
    "decoratorAutoAccessors",
    "destructuringPrivate",
    "doExpressions",
    "explicitResourceManagement",
    "exportDefaultFrom",
    "functionBind",
    "functionSent",
    "importAssertions",
    "importReflection",
    "moduleBlocks",
    "partialApplication",
    ["pipelineOperator", { proposal: "minimal" }],
    "recordAndTuple",
    "regexpUnicodeSets",
    "throwExpressions",
  ];

  return {
    babelOptions: {
      babelrc: false,
      babelrcRoots: false,
      configFile: false,
      filename: fileName,
      parserOpts: {
        plugins: [
          ...defaultParserPlugins,
          ["ts", "tsx"].includes(fileExt) ? "typescript" : "flow",
        ],
      },
    },
  };
}
function isPrimitiveType(type) {
  return (
    type === "boolean" ||
    type === "bool" ||
    type === "number" ||
    type === "string"
  );
}

function filterComponentProps([, propDescr]: [
  string,
  Documentation["props"][string]
]) {
  const { type, tsType, flowType } = propDescr;

  let isMappableType = false;

  if (tsType) {
    isMappableType = isPrimitiveType(tsType.name);
  } else if (flowType) {
    isMappableType = isPrimitiveType(flowType.name);
  } else if (type) {
    // js type (PropTypes)

    isMappableType = isPrimitiveType(type.name);
  }

  return isMappableType;
}

function getComponentMappablePropType(
  propDescr: Documentation["props"][string]
): MappableProp["type"] {
  const type = propDescr.tsType
    ? propDescr.tsType.name
    : propDescr.flowType
    ? propDescr.flowType.name
    : propDescr.type.name;

  if (type === "boolean" || type === "bool") {
    return "boolean";
  }

  if (type === "number") {
    return "number";
  }

  if (type === "string") {
    return "string";
  }

  // default value (should not be a case, just to get rid of a TS complain)
  return "string";
}

export function getComponentMappableProps(
  docs: Documentation[]
): MappableProp[] {
  if (docs.length === 0 || !docs[0].props) {
    return [];
  }

  // it's possible that in one file there are 2 components
  // that's why docs is an array, but we only need one component
  return Object.entries(docs[0].props)
    .filter(filterComponentProps)
    .map(([name, propDescr]) => ({
      name,
      type: getComponentMappablePropType(propDescr),
      isRequired: !!propDescr.required,
      description: propDescr.description,
    }));
}

export interface CmsSchema extends JSONSchema4 {
  properties: {
    [k: string]: {
      type: "boolean" | "number" | "string";
    };
  };
  required: string[];
}

export function getCmsMappableFields(schema: CmsSchema): MappableProp[] {
  return Object.entries(schema.properties)
    .filter(([, { type }]) => isPrimitiveType(type))
    .map(([name, { type }]) => ({
      name,
      type,
      isRequired: schema.required.includes(name),
    }));
}
