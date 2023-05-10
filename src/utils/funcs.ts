import axios from "axios";
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
  ConverterFunc,
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
    // since we parse cms data files, a field can't be not required,
    // cos it's always presented in the file
    isRequired: true,
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

export function formatMappablePropType(mappableProp: MappableProp) {
  // todo: change it to the desired format when the UI is ready
  return getMappablePropTypeSignature(mappableProp);
}

export function canMapProps(
  cmsField: MappableProp,
  componentProp: MappableProp
): ConverterFunc | boolean {
  // if 2 props can be mapped we return a converter function (if needed) or true, otherwise - false

  if (componentProp.type === TSType.Array) {
    // if both arrays are of the same type
    if (cmsField.type === TSType.Array) {
      return (
        !!componentProp.subTypes &&
        !!cmsField.subTypes &&
        componentProp.subTypes[0] === cmsField.subTypes[0]
      );
    }

    // since we only work with arrays of primitive types,
    // we can also convert any single variable of a primitive type by creating an array with only this varible
    if (
      !!componentProp.subTypes &&
      componentProp.subTypes[0] === cmsField.type
    ) {
      return (p) => `[${p}]`;
    }
  }

  if (componentProp.type === TSType.Boolean) {
    if (cmsField.type === TSType.Boolean) {
      return true;
    }

    // allow any type to be mapped to a boolean field by doing a simple conversion with !!
    return (p) => `!!${p}`;
  }

  if (componentProp.type === TSType.Number) {
    if (cmsField.type === TSType.Number) {
      return true;
    }

    if (cmsField.type === TSType.Boolean || cmsField.type === TSType.String) {
      return (p) => `Number(${p})`;
    }
  }

  if (componentProp.type === TSType.String) {
    if (cmsField.type === TSType.String) {
      return true;
    }

    // any type can be converted to string
    return (p) => `"" + ${p}`;
  }

  if (componentProp.type === TSType.Union) {
    if (
      componentProp.subTypes &&
      componentProp.subTypes.includes(cmsField.type)
    ) {
      return true;
    }
  }

  // only for TS components, PropTypes don't have a null type
  if (componentProp.type === TSType.Null) {
    if (cmsField.type === TSType.Null) {
      return true;
    }
  }

  // only TS has the undefined type, plus in TS not required fields mean that they can be undefined
  // in PropTypes only the "required" flag defines if a field can be null or undefined
  if (componentProp.type === TSType.Undefined || !componentProp.isRequired) {
    // JSON only has null type, so just "convert" it to undefined
    // since it fits for both type systems
    if (cmsField.type === TSType.Null) {
      return (p) => `${p} ?? undefined`;
    }
  }

  return false;
}

export function getCMSFieldPath(
  cmsField: MappableProp,
  compProp: MappableProp
) {
  const cmsFieldPath = `cmsData.${cmsField.name}`;
  const convert = canMapProps(cmsField, compProp);

  return typeof convert === "function" ? convert(cmsFieldPath) : cmsFieldPath;
}

export function getMappablePropTypeSignature(mappableProp: MappableProp) {
  if (mappableProp.type === TSType.Array && mappableProp.subTypes) {
    return `${mappableProp.subTypes[0]}[]`;
  }

  if (mappableProp.type === TSType.Union && mappableProp.subTypes) {
    return mappableProp.subTypes.join(" | ");
  }

  return mappableProp.type;
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
    `${prop.name}${prop.isRequired ? "" : "?"}: ${getMappablePropTypeSignature(
      prop
    )};`;

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
