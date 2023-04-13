import type { Documentation, Config } from "react-docgen";
import type { MappableProp } from "./types";

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

function filterComponentProps([, propDescr]: [
  string,
  Documentation["props"][string]
]) {
  const { type, tsType, flowType } = propDescr;

  let isMappableType = false;

  if (tsType) {
    isMappableType =
      tsType.name === "boolean" ||
      tsType.name === "number" ||
      tsType.name === "string";
  } else if (flowType) {
    isMappableType =
      flowType.name === "boolean" ||
      flowType.name === "number" ||
      flowType.name === "string";
  } else if (type) {
    // js type (PropTypes)

    isMappableType =
      type.name === "bool" || type.name === "number" || type.name === "string";
  }

  return isMappableType;
}

export function getComponentMappableProps(
  docs: Documentation[]
): MappableProp[] {
  if (docs.length === 0 || !docs[0].props) {
    return [];
  }

  return Object.entries(docs[0].props)
    .filter(filterComponentProps)
    .map(([name, propDescr]) => ({
      name,
      type: propDescr.tsType
        ? propDescr.tsType.name
        : propDescr.flowType
        ? propDescr.flowType.name
        : propDescr.type.name, // js type
      isRequired: !!propDescr.required,
      description: propDescr.description,
    }));
}
