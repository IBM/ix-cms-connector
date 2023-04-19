export interface MappableProp {
  name: string;
  type: "boolean" | "number" | "string";
  isRequired: boolean;
  description?: string;
}

export type MappedFields = [MappableProp, MappableProp][];

export interface CodeGeneratorOptions {
  syntax?: "typescript" | "javascript";
}
