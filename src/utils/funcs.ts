import axios from "axios";
import { JSONSchema4TypeName } from "json-schema";
import toJsonSchema from "to-json-schema";
import type { Documentation, Config } from "react-docgen";
import type {
  PropDescriptor,
  PropTypeDescriptor,
} from "react-docgen/dist/Documentation";
import { JSONType, JSType, TSType, CommonType } from "./const";
import type {
  JSONSchema,
  CodeGeneratorOptions,
  MappableProp,
  MappedProps,
  TimeoutHandle,
  MappablePropType,
} from "./types";
import CodeBlockWriter from "code-block-writer";

async function fetchData(endpoint: string) {
  const res = await axios(endpoint);

  return await res.data;
}

export async function getJSONSchema(endpoint: string) {
  const json = await fetchData(endpoint);

  const schema = toJsonSchema(json);

  return schema;
}

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

export function getComponentPropType(
  propDescr: PropDescriptor
): MappablePropType | undefined {
  const { type, tsType } = propDescr;

  // primitive types in PropTypes and TS and their corresponding MappablePropType
  const primitiveTypesMap: Record<string, MappablePropType> = {
    [TSType.Boolean]: CommonType.Boolean,
    [JSType.Boolean]: CommonType.Boolean,
    [TSType.Number]: CommonType.Number, // same as JSType.Number
    [TSType.String]: CommonType.String, // same as JSType.String
  };
  const primitiveTypes = Object.keys(primitiveTypesMap);

  if (tsType) {
    if (primitiveTypes.includes(tsType.name)) {
      return primitiveTypesMap[tsType.name];
    }

    if (tsType.name === TSType.Array) {
      // an example of array field schema:
      // "tsType": { "name": "Array", "elements": [{ "name": "string" }], "raw": "string[]" }

      const itemsType = (tsType.raw ?? "").replace("[]", "");

      if (primitiveTypes.includes(itemsType)) {
        return `${primitiveTypesMap[itemsType]}[]` as MappablePropType;
      }
    }
  } else if (type) {
    // js type (PropTypes)

    if (primitiveTypes.includes(type.name)) {
      return primitiveTypesMap[type.name];
    }

    if (type.name === "arrayOf") {
      // an example of array field schema:
      // "type": { "name": "arrayOf", "value": { "name": "number" } }

      const itemsType = (type.value as PropTypeDescriptor)?.name ?? "";

      if (primitiveTypes.includes(itemsType)) {
        return `${primitiveTypesMap[itemsType]}[]` as MappablePropType;
      }
    }
  }

  return undefined;
}

export function getComponentMappableProps(doc: Documentation): MappableProp[] {
  if (!doc.props) {
    return [];
  }

  return Object.entries(doc.props).reduce(
    (mappableProps, [name, propDescr]) => {
      const type = getComponentPropType(propDescr);

      if (type) {
        mappableProps.push({
          name,
          type,
          isRequired: !!propDescr.required,
          description: propDescr.description,
        });
      }

      return mappableProps;
    },
    [] as MappableProp[]
  );
}

export function getCMSFieldType(
  fieldSchema: JSONSchema
): MappablePropType | undefined {
  // primitive types in JSON and their corresponding MappablePropType
  const primitiveTypesMap: Record<string, MappablePropType> = {
    [JSONType.Boolean]: CommonType.Boolean,
    [JSONType.Integer]: CommonType.Number,
    [JSONType.Number]: CommonType.Number,
    [JSONType.String]: CommonType.String,
  };
  const primitiveTypes = Object.keys(primitiveTypesMap);

  const isSimpleArray = (fs: JSONSchema) => {
    // itemsType only has value when all the items have the same type
    const itemsType =
      fs.items && typeof fs.items === "object"
        ? ((fs.items as JSONSchema).type as JSONSchema4TypeName)
        : undefined;

    return fs.type === JSONType.Array && primitiveTypes.includes(itemsType);
  };

  const { type } = fieldSchema;

  if (typeof type === "string") {
    if (primitiveTypes.includes(type)) {
      return primitiveTypesMap[type];
    }

    if (isSimpleArray(fieldSchema)) {
      return `${
        primitiveTypesMap[
          (fieldSchema.items as JSONSchema).type as JSONSchema4TypeName
        ]
      }[]` as MappablePropType;
    }
  }

  return undefined;
}

export function getCmsMappableFields(schema: JSONSchema): MappableProp[] {
  return Object.entries(schema.properties).reduce(
    (mappableProps, [name, fieldSchema]) => {
      const type = getCMSFieldType(fieldSchema);

      if (type) {
        mappableProps.push({
          name,
          type,
          isRequired: !!fieldSchema.required,
        });
      }

      return mappableProps;
    },
    [] as MappableProp[]
  );
}

export function canMapProps(
  cmsField: MappableProp,
  componentProp: MappableProp
) {
  const fullMatch = cmsField.type === componentProp.type;

  const primitiveTypes = [
    CommonType.Boolean,
    CommonType.Number,
    CommonType.String,
  ];
  const canBeConverted =
    primitiveTypes.includes(cmsField.type) &&
    primitiveTypes.includes(componentProp.type);

  return fullMatch || canBeConverted;
}

function getCMSFieldPath(cmsField: MappableProp, compProp: MappableProp) {
  let cmsFieldPath = `cmsData.${cmsField.name}`;

  // for simple types it is possible to do a conversion
  if (
    compProp.type === CommonType.Boolean &&
    (cmsField.type === CommonType.Number || cmsField.type === CommonType.String)
  ) {
    cmsFieldPath = `Boolean(${cmsFieldPath})`;
  } else if (
    compProp.type === CommonType.Number &&
    (cmsField.type === CommonType.Boolean ||
      cmsField.type === CommonType.String)
  ) {
    cmsFieldPath = `Number(${cmsFieldPath})`;
  } else if (
    compProp.type === CommonType.String &&
    (cmsField.type === CommonType.Boolean ||
      cmsField.type === CommonType.Number)
  ) {
    cmsFieldPath = `${cmsFieldPath}.toString()`;
  }

  // for other cases we just return the default path
  return cmsFieldPath;
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

  const addTypePropertyDef = (prop: MappableProp) =>
    `${prop.name}${prop.isRequired ? "" : "?"}: ${prop.type};`;

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
