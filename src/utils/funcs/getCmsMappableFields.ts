/*
 * Copyright 2020- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
import { JSONType, TSType } from "../const";
import type { JSONSchema, MappableProp } from "../types";

export function getCmsMappableField(
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
      const mappableField = getCmsMappableField(name, fieldSchema);

      // nested cms fields
      if (fieldSchema.type === "object") {
        const mappableSubFields = getCmsMappableFields(fieldSchema).map(
          (obj) => ({ ...obj, name: `${name}.${obj.name}` })
        );
        mappableFields = [...mappableFields, ...mappableSubFields];
      }
      if (mappableField) {
        mappableFields.push(mappableField);
      }

      return mappableFields;
    },
    [] as MappableProp[]
  );
}
