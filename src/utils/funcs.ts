import type { Documentation, Config } from "react-docgen";
import type { CodeGeneratorOptions, MappableProp, MappedFields } from "./types";
import CodeBlockWriter from "code-block-writer";

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

export function generateAdapterCode(
  componentDoc: Documentation,
  mappedFields: MappedFields,
  options?: CodeGeneratorOptions
) {
  // typescript is a default syntax to use
  const isTS = !options || !options.syntax || options.syntax === "typescript";

  const componentName = componentDoc.displayName ?? "Component";
  const hofName = `connect${componentName}ToCMS`;
  const hocName = `CMS${componentName}`;

  const cmsPropsType = `{ ${mappedFields
    .map((mf) => `${mf[0].name}: ${mf[0].type};`)
    .join(" ")} }`;
  const componentMappedPropsUnionOld = mappedFields
    .map((mf) => `"${mf[1].name}"`)
    .join(" | ");
  const getComponentMappedPropsUnion = (useSingleQuote: boolean) => {
    const quoteMark = useSingleQuote ? "'" : '"';

    return mappedFields
      .map((mf) => `${quoteMark}${mf[1].name}${quoteMark}`)
      .join(" | ");
  };

  const mappedCMSPropsVar = `{ ${mappedFields
    .map((mf) => `${mf[1].name}: cmsProps.${mf[0].name}`)
    .join(", ")} }`;

  const manualSnippet = `
    // Don't forget to import React.ComponentProps and your component!
    import { ComponentProps } from "react";
    import Component from '...';

    function ${hofName}(cmsProps: ${cmsPropsType}) {
      return function ${hocName}(
        componentProps: Omit<ComponentProps<typeof ${componentName}>, ${componentMappedPropsUnionOld}> & Partial<Pick<ComponentProps<typeof ${componentName}>, ${componentMappedPropsUnionOld}>>
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

  const writer = new CodeBlockWriter({
    indentNumberOfSpaces: 2,
    // useSingleQuote: true,
  });

  const componentMappedPropsUnion = getComponentMappedPropsUnion(
    writer.getOptions().useSingleQuote
  );

  const snippet = writer
    .writeLine(
      "// Don't forget to import React.ComponentProps and your component!"
    )
    .write("import { ComponentProps } from ")
    .quote("react")
    .write(";")
    .newLine()
    .write(`import ${componentName} from `)
    .quote("path-to-your-component")
    .write(";")
    .blankLine()

    .write(`function ${hofName}(cmsProps: ${cmsPropsType})`)
    .block(() => {
      writer
        .writeLine(`return function ${hocName}(`)
        .indent()
        .write(
          `componentProps: Omit<ComponentProps<typeof ${componentName}>, ${componentMappedPropsUnion}> & Partial<Pick<ComponentProps<typeof ${componentName}>, ${componentMappedPropsUnion}>>`
        )
        .newLine()
        .write(")")
        .block(() => {
          writer
            .writeLine(`const mappedCMSProps = ${mappedCMSPropsVar};`)
            .blankLine()
            .write(`const allProps: ComponentProps<typeof ${componentName}> = `)
            .inlineBlock(() => {
              writer
                .writeLine("...mappedCMSProps,")
                .writeLine("...componentProps,");
            })
            .write(";")
            .blankLine()
            .write(`return <${componentName} {...allProps} />;`);
        });
    });

  return snippet.toString();
}
