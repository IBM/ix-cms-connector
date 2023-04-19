import type { Documentation, Config } from "react-docgen";
import type { CodeGeneratorOptions, MappableProp, MappedFields } from "./types";

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

export function generateAdapterCode(
  componentDoc: Documentation,
  mappedFields: MappedFields,
  options?: CodeGeneratorOptions
) {
  const componentName = componentDoc.displayName ?? "Component";
  const hofName = `connect${componentName}ToCMS`;
  const hocName = `CMS${componentName}`;

  const cmsPropsType = `{ ${mappedFields
    .map((mf) => `${mf[0].name}: ${mf[0].type};`)
    .join(" ")} }`;
  const componentMappedPropsUnion = mappedFields
    .map((mf) => `"${mf[1].name}"`)
    .join(" | ");

  const mappedCMSPropsVar = `{ ${mappedFields
    .map((mf) => `${mf[1].name}: cmsProps.${mf[0].name}`)
    .join(", ")} }`;

  return `
    // Don't forget to import React.ComponentProps and your component!
    import { ComponentProps } from "react";
    import Component from '...';

    function ${hofName}(cmsProps: ${cmsPropsType}) {
      return function ${hocName}(
        componentProps: Omit<ComponentProps<typeof ${componentName}>, ${componentMappedPropsUnion}> & Partial<Pick<ComponentProps<typeof ${componentName}>, ${componentMappedPropsUnion}>>
      ) {
        const mappedCMSProps = ${mappedCMSPropsVar};
    
        const allProps: ComponentProps<typeof ${componentName}> = {
          ...mappedCMSProps,
          ...componentProps,
        };
    
        return <${componentName} {...allProps} />;
      };
    }
  `;
}
