import toJsonSchema from "to-json-schema";
import type { Options as CodeBlockWriterOptions } from "code-block-writer";

export type JSONSchema = toJsonSchema.JSONSchema3or4;

export interface MappableProp {
  name: string;
  type: "boolean" | "number" | "string";
  isRequired: boolean;
  description?: string;
}

export type MappedProps = [MappableProp, MappableProp][];

export type CodeGeneratorOptions = Partial<CodeBlockWriterOptions>;

export type TimeoutHandle = ReturnType<typeof setTimeout>;
