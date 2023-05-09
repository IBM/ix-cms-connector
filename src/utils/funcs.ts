import axios from "axios";
import { JSONSchema4TypeName } from "json-schema";
import toJsonSchema from "to-json-schema";
import type { Documentation, Config } from "react-docgen";
import type {
  PropDescriptor,
  PropTypeDescriptor,
} from "react-docgen/dist/Documentation";
import { JSONType, JSPropType, TSType } from "./const";
import type {
  JSONSchema,
  CodeGeneratorOptions,
  MappableProp,
  MappedProps,
  TimeoutHandle,
} from "./types";
import CodeBlockWriter from "code-block-writer";

export async function fetchData(endpoint: string) {
  const res = await axios(endpoint);

  return await res.data;
}

export async function getJSONSchema(endpoint: string) {
  const json = await fetchData(endpoint);

  const schema = toJsonSchema(json);

  return schema;
}

export function getComponentParserConfig(fileName: string): Config {
  const fileExt = fileName.split(".").pop()?.toLowerCase() ?? "";

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

export function getComponentMappableProp(
  propName: string,
  propDescr: PropDescriptor
): MappableProp | undefined {
  const { type, tsType } = propDescr;

  const mappableProp = {
    name: propName,
    isRequired: !!propDescr.required,
  };

  if (tsType) {
    const primitiveTypes = [
      TSType.Boolean,
      TSType.Number,
      TSType.String,
      TSType.Null,
      TSType.Undefined,
    ];

    const primitiveType = primitiveTypes.find((t) => t === tsType.name);

    if (primitiveType) {
      return {
        ...mappableProp,
        type: primitiveType,
      };
    }

    if (
      (tsType.name === TSType.Array || tsType.name === TSType.Union) &&
      "elements" in tsType
    ) {
      // an example of array and union fields:
      // "tsType": { "name": "Array", "elements": [{ "name": "string" }], "raw": "string[]" }
      // "tsType": { "name": "union", "elements": [{ "name": "number" }, { "name": "null" }], "raw": "number | null" }

      const isArray = tsType.name === TSType.Array;

      const isSimpleArray =
        isArray &&
        tsType.elements &&
        tsType.elements.length === 1 &&
        primitiveTypes.some((t) => t === tsType.elements[0].name);

      const isSimpleUnion =
        !isArray &&
        tsType.elements &&
        tsType.elements.length &&
        tsType.elements.every((el) =>
          primitiveTypes.some((t) => t === el.name)
        );

      if (isSimpleArray || isSimpleUnion) {
        return {
          ...mappableProp,
          type: isArray ? TSType.Array : TSType.Union,
          subTypes: tsType.elements.map((el) => el.name as TSType),
        };
      }
    }
  } else if (type) {
    // JS type (PropTypes)

    const primitiveTypesMap = {
      [JSPropType.Boolean]: TSType.Boolean,
      [JSPropType.Number]: TSType.Number,
      [JSPropType.String]: TSType.String,
    };

    if (primitiveTypesMap[type.name]) {
      return {
        ...mappableProp,
        type: primitiveTypesMap[type.name],
      };
    }

    if (
      (type.name === JSPropType.ArrayOfType ||
        type.name === JSPropType.Union) &&
      type.value
    ) {
      // an example of array field schema:
      // "type": { "name": "arrayOf", "value": { "name": "number" } }
      // "type": { "name": "union", "value": [{ "name": "number" }, { "name": "string" }] },

      const isArray = type.name === JSPropType.ArrayOfType;

      const isSimpleArray =
        isArray && !!primitiveTypesMap[(type.value as PropTypeDescriptor).name];

      const isSimpleUnion =
        !isArray &&
        (type.value as PropTypeDescriptor[]).every(
          (t) => !!primitiveTypesMap[t.name]
        );

      if (isSimpleArray || isSimpleUnion) {
        return {
          ...mappableProp,
          type: isArray ? TSType.Array : TSType.Union,
          subTypes: isSimpleArray
            ? primitiveTypesMap[(type.value as PropTypeDescriptor).name]
            : (type.value as PropTypeDescriptor[]).map(
                (t) => primitiveTypesMap[t.name]
              ),
        };
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
      const mappableProp = getComponentMappableProp(name, propDescr);

      if (mappableProp) {
        mappableProps.push(mappableProp);
      }

      return mappableProps;
    },
    [] as MappableProp[]
  );
}

export function getCMSMappableField(
  fieldName: string,
  fieldSchema: JSONSchema
): MappableProp | undefined {
  const { type } = fieldSchema;

  const mappableField = {
    name: fieldName,
    isRequired: !!fieldSchema.required,
  };

  // primitive JSON types and their corresponding TSType
  const primitiveTypesMap: Record<string, TSType> = {
    [JSONType.Boolean]: TSType.Boolean,
    [JSONType.Integer]: TSType.Number,
    [JSONType.Number]: TSType.Number,
    [JSONType.String]: TSType.String,
    [JSONType.Null]: TSType.Null,
  };

  const getSimpleArrayType = (fs: JSONSchema) => {
    // trying to get the items (only arrays have it) type
    // it should be a single type, not another array nor a union
    const itemsType =
      fs.items && !Array.isArray(fs.items)
        ? fs.items.type && !Array.isArray(fs.items.type)
          ? fs.items.type
          : undefined
        : undefined;

    if (
      fs.type === JSONType.Array &&
      itemsType &&
      !!primitiveTypesMap[itemsType]
    ) {
      return itemsType;
    } else {
      return undefined;
    }
  };

  // type is a single type
  if (typeof type === "string") {
    if (primitiveTypesMap[type]) {
      return {
        ...mappableField,
        type: primitiveTypesMap[type],
      };
    }

    const simpleArrayType = getSimpleArrayType(fieldSchema);

    if (simpleArrayType) {
      return {
        ...mappableField,
        type: TSType.Array,
        subTypes: [primitiveTypesMap[simpleArrayType]],
      };
    }
  } else if (Array.isArray(type)) {
    // type is a union of single types

    if (type.every((t) => !!primitiveTypesMap[t])) {
      return {
        ...mappableField,
        type: TSType.Union,
        subTypes: type.map((t) => primitiveTypesMap[t]),
      };
    }
  }

  return undefined;
}

export function getCmsMappableFields(schema: JSONSchema): MappableProp[] {
  return Object.entries(schema.properties ?? {}).reduce(
    (mappableFields, [name, fieldSchema]) => {
      const mappableField = getCMSMappableField(name, fieldSchema);

      if (mappableField) {
        mappableFields.push(mappableField);
      }

      return mappableFields;
    },
    [] as MappableProp[]
  );
}

export function formatPropType(mappableProp: MappableProp) {
  // todo: change it to the desired format when the UI is ready
  if (mappableProp.type === TSType.Array && mappableProp.subTypes) {
    return `${mappableProp.subTypes[0]}[]`;
  }

  if (mappableProp.type === TSType.Union && mappableProp.subTypes) {
    return mappableProp.subTypes.join(" | ");
  }

  return mappableProp.type;
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
  const isTS = Object.entries(componentDoc.props ?? {}).some(
    ([, pd]) => pd.tsType
  );

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
