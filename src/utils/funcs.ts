import type { Documentation, Config } from "react-docgen";
import type {
  CmsSchema,
  CodeGeneratorOptions,
  MappableProp,
  MappedFields,
} from "./types";
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

export function isPrimitiveType(type: string) {
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

export function getComponentMappableProps(doc: Documentation): MappableProp[] {
  if (!doc.props) {
    return [];
  }

  return Object.entries(doc.props)
    .filter(filterComponentProps)
    .map(([name, propDescr]) => ({
      name,
      type: getComponentMappablePropType(propDescr),
      isRequired: !!propDescr.required,
      description: propDescr.description,
    }));
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

export function generateAdapterCode(
  componentDoc: Documentation,
  mappedFields: MappedFields,
  options?: CodeGeneratorOptions
) {
  // typescript is a default syntax to use
  const isTS = !options || !options.syntax || options.syntax === "typescript";

  const componentName = componentDoc.displayName ?? "Component";
  const hofName = `connect${componentName}ToCMS`;
  const mappedCMSFieldsTypeName = `${componentName}MappedCMSFields`;
  const mappedPropsTypeName = `${componentName}MappedProps`;

  const addTypeProperty = (p: MappableProp) =>
    `${p.name}${p.isRequired ? "" : "?"}: ${p.type};`;

  const mappedPropsVariable = mappedFields.map(
    (mf) => `${mf[1].name}: cmsData.${mf[0].name},`
  );

  const writer = new CodeBlockWriter({
    indentNumberOfSpaces: 2,
    // useSingleQuote: true,
  });

  const snippet = writer
    .write("import { ComponentType } from ")
    .quote("react")
    .write(";")

    .blankLine()

    .write(`interface ${mappedCMSFieldsTypeName}`)
    .block(() => {
      mappedFields.forEach((f) => writer.writeLine(addTypeProperty(f[0])));
    })

    .blankLine()

    .write(`interface ${mappedPropsTypeName}`)
    .block(() => {
      mappedFields.forEach((f) => writer.writeLine(addTypeProperty(f[1])));
    })

    .blankLine()

    .write(`function ${hofName}(cmsData: ${mappedCMSFieldsTypeName})`)
    .block(() => {
      writer
        .writeLine(`return function enhance<P extends ${mappedPropsTypeName}>(`)

        .indent()
        .write("Component: ComponentType<P>")
        .newLine()

        .write(") ")
        .inlineBlock(() => {
          writer
            .writeLine(`return function ConnectedComponent(`)

            .indent()
            .write(
              `restProps: Omit<P, keyof ${mappedPropsTypeName}> & Partial<${mappedPropsTypeName}>`
            )
            .newLine()

            .write(") ")
            .inlineBlock(() => {
              writer
                .write(`const mappedProps: ${mappedPropsTypeName} = `)
                .inlineBlock(() => {
                  mappedPropsVariable.forEach((p) => writer.writeLine(p));
                })
                .write(";")

                .blankLine()

                .write(`const allProps = `)
                .inlineBlock(() => {
                  writer
                    .writeLine("...mappedProps,")
                    .writeLine("...restProps,");
                })
                .write(" as P;")

                .blankLine()

                .write(`return <Component {...allProps} />;`);
            })
            .write(";");
        })
        .write(";");
    });

  return snippet.toString();
}
