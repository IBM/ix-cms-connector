export enum JSONType {
  Array = "array",
  Boolean = "boolean",
  Integer = "integer",
  Number = "number",
  String = "string",
  // null
  // undefined (if using schema and the field is not required)
}

export enum JSType {
  ArrayOfType = "arrayOf",
  Boolean = "bool",
  Number = "number",
  String = "string",
  // "required": false, any of the types
}

export enum TSType {
  Array = "Array",
  Boolean = "boolean",
  Number = "number",
  String = "string",
}

export enum CommonType {
  Boolean = "boolean",
  Number = "number",
  String = "string",
  BooleanArray = "boolean[]",
  NumberArray = "number[]",
  StringArray = "string[]",
  // isRequired: boolean;
}
