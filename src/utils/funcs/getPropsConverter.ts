import { TSType } from "../const";
import type { MappableProp, ConverterFunc } from "../types";

// in case if a field shouldn't be converted and just passed as it is
const DUMMY_CONVERTER: ConverterFunc = (p) => p;

export function getPropsConverter(
  cmsField: MappableProp,
  componentProp: MappableProp
): ConverterFunc | undefined {
  // if 2 props can be mapped we return a converter function (if needed) or true, otherwise - false

  if (componentProp.type === TSType.Array) {
    // if both arrays are of the same type
    if (cmsField.type === TSType.Array) {
      const areArraysOfSameType =
        !!componentProp.subTypes &&
        !!cmsField.subTypes &&
        componentProp.subTypes[0] === cmsField.subTypes[0];

      return areArraysOfSameType ? DUMMY_CONVERTER : undefined;
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
      return DUMMY_CONVERTER;
    }

    // allow any type to be mapped to a boolean field by doing a simple conversion with !!
    // except if the component prop is not required and the CMS field is null
    // in that case null will be passed without any conversion (see last if statement)
    if (componentProp.isRequired || cmsField.type !== TSType.Null) {
      return (p) => `!!${p}`;
    }
  }

  if (componentProp.type === TSType.Number) {
    if (cmsField.type === TSType.Number) {
      return DUMMY_CONVERTER;
    }

    if (cmsField.type === TSType.Boolean || cmsField.type === TSType.String) {
      return (p) => `Number(${p})`;
    }
  }

  if (componentProp.type === TSType.String) {
    if (cmsField.type === TSType.String) {
      return DUMMY_CONVERTER;
    }

    // any type can be converted to string
    // except if the component prop is not required and the CMS field is null
    // in that case null will be passed without any conversion (see last if statement)
    if (componentProp.isRequired || cmsField.type !== TSType.Null) {
      return (p) => `\`\${${p}}\``;
    }
  }

  if (componentProp.type === TSType.Union) {
    if (
      componentProp.subTypes &&
      componentProp.subTypes.includes(cmsField.type)
    ) {
      return DUMMY_CONVERTER;
    }
  }

  // only for TS components, PropTypes don't have a null type
  if (componentProp.type === TSType.Null) {
    if (cmsField.type === TSType.Null) {
      return DUMMY_CONVERTER;
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

  return undefined;
}

export function canMapProps(
  cmsField?: MappableProp,
  componentProp?: MappableProp
): boolean {
  return cmsField && componentProp
    ? !!getPropsConverter(cmsField, componentProp)
    : false;
}
