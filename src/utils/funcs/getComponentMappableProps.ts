import type { Documentation } from "react-docgen";
import type {
  ObjectSignatureType,
  PropDescriptor,
  PropTypeDescriptor,
  TypeDescriptor,
} from "react-docgen/dist/Documentation";
import { JSPropType, TSType } from "../const";
import type { MappableProp } from "../types";

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

      // nested component props
      if (
        (propDescr?.tsType as ObjectSignatureType)?.type === "object" ||
        propDescr?.type?.name === "shape"
      ) {
        // TS or JS props
        const isTS = !!propDescr.tsType;

        const nestedProps = isTS
          ? (propDescr.tsType as ObjectSignatureType).signature.properties
          : Object.keys(propDescr.type.value).map((key) => ({
              ...propDescr.type.value[key],
              key,
            }));

        const props = nestedProps.reduce(
          (acc, curr) => ({
            ...acc,
            ...{
              [`${name}.${curr.key}`]: {
                [isTS ? "tsType" : "type"]: isTS
                  ? curr.value
                  : { name: curr.name, value: curr.value },
                required: isTS ? curr.value.required : curr.required,
              },
            },
          }),
          {} as { key: string; value: TypeDescriptor }
        );

        const subMappableProps = getComponentMappableProps({ props });

        mappableProps = [...mappableProps, ...subMappableProps];
      }

      if (mappableProp) {
        mappableProps.push(mappableProp);
      }

      return mappableProps;
    },
    [] as MappableProp[]
  );
}
