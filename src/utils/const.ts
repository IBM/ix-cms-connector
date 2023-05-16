// there is no "undefined" type in JSON
export enum JSONType {
  Array = "array",
  Boolean = "boolean",
  Integer = "integer",
  Number = "number",
  String = "string",
  Null = "null",
}

// there is no "null" or "undefined" PropTypes
// it's defined only by the "required" flag
export enum JSPropType {
  ArrayOfType = "arrayOf",
  Boolean = "bool",
  Number = "number",
  String = "string",
  Union = "union",
}

// we also use TS types as our common types
// since it's possible to describe any type definition with them
export enum TSType {
  Array = "Array",
  Boolean = "boolean",
  Number = "number",
  String = "string",
  Null = "null",
  Undefined = "undefined",
  Union = "union",
}

export enum Source {
  CMS,
  COMPONENT,
}
