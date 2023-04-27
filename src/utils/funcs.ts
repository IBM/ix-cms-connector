import type { Documentation, Config } from "react-docgen";
import type {
  CmsSchema,
  CodeGeneratorOptions,
  MappableProp,
  MappedProps,
  TimeoutHandle,
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
  mappedProps: MappedProps,
  options?: CodeGeneratorOptions
) {
  // if the component has a tsType field in any of the PropDescriptor, then it's Typescript
  const isTS = Object.entries(componentDoc.props).some(([, pd]) => pd.tsType);

  // helper variables and functions
  const componentName = componentDoc.displayName ?? "Component";
  const hofName = `connect${componentName}ToCMS`;
  const mappedCMSFieldsTypeName = `${componentName}MappedCMSFields`;
  const mappedPropsTypeName = `${componentName}MappedProps`;

  const addTypePropertyDef = (p: MappableProp) =>
    `${p.name}${p.isRequired ? "" : "?"}: ${p.type};`;

  const getCMSFieldPath = (cmsField: MappableProp, compProp: MappableProp) => {
    const cmsFieldPath = `cmsData.${cmsField.name}`;

    if (compProp.type === "boolean" && cmsField.type !== "boolean") {
      return `Boolean(${cmsFieldPath})`;
    }

    if (compProp.type === "number" && cmsField.type !== "number") {
      return `Number(${cmsFieldPath})`;
    }

    if (compProp.type === "string" && cmsField.type !== "string") {
      return `${cmsFieldPath}.toString()`;
    }

    return cmsFieldPath;
  };

  const mappedPropsDeclarations = mappedProps.map(
    (mf) => `${mf[1].name}: ${getCMSFieldPath(mf[0], mf[1])},`
  );

  const addInlineTypeDef = (typeDefinition: string) =>
    isTS ? typeDefinition : "";

  // start writing

  const writer = new CodeBlockWriter({
    ...options,
  });

  // if it's TS, then we need to add some type imports and defenitions
  let requiredTypeDefs: CodeBlockWriter;

  if (isTS) {
    requiredTypeDefs = writer
      .write("import { ComponentType } from ")
      .quote("react")
      .write(";")

      .blankLine()

      // an interface for the mapped CMS fields
      .write(`interface ${mappedCMSFieldsTypeName}`)
      .block(() => {
        mappedProps.forEach((f) => writer.writeLine(addTypePropertyDef(f[0])));
      })

      .blankLine()

      // an interface for the mapped component props
      .write(`interface ${mappedPropsTypeName}`)
      .block(() => {
        mappedProps.forEach((f) => writer.writeLine(addTypePropertyDef(f[1])));
      })

      .blankLine();
  } else {
    requiredTypeDefs = writer;
  }

  // then we are creating our function (see samples/adaptor/connect.tsx as an example of the ready function)
  // we use addInlineTypeDef() function to conditionaly (if it's a TS component) add type definitions
  const snippetCode = requiredTypeDefs
    .write(
      `function ${hofName}(cmsData${addInlineTypeDef(
        `: ${mappedCMSFieldsTypeName}`
      )})`
    )
    .block(() => {
      writer
        .writeLine(
          `return function enhance${addInlineTypeDef(
            `<P extends ${mappedPropsTypeName}>`
          )}(`
        )

        .indent()
        .write(`Component${addInlineTypeDef(": ComponentType<P>")}`)
        .newLine()

        .write(") ")
        .inlineBlock(() => {
          writer
            .writeLine(`return function ConnectedComponent(`)

            .indent()
            .write(
              `restProps${addInlineTypeDef(
                `: Omit<P, keyof ${mappedPropsTypeName}> & Partial<${mappedPropsTypeName}>`
              )}`
            )
            .newLine()

            .write(") ")
            .inlineBlock(() => {
              writer
                .write(
                  `const mappedProps${addInlineTypeDef(
                    `: ${mappedPropsTypeName}`
                  )} = `
                )
                .inlineBlock(() => {
                  mappedPropsDeclarations.forEach((p) => writer.writeLine(p));
                })
                .write(";")

                .blankLine()

                .write(`const allProps = `)
                .inlineBlock(() => {
                  writer
                    .writeLine("...mappedProps,")
                    .writeLine("...restProps,");
                })
                .write(`${addInlineTypeDef(" as P")};`)

                .blankLine()

                .write(`return <Component {...allProps} />;`);
            })
            .write(";");
        })
        .write(";");
    });

  return snippetCode.toString();
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: TimeoutHandle | undefined;

  return function debounced(...args: Parameters<T>): void {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
