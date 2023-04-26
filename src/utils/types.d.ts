import { JSONSchema4 } from "json-schema";
import type { Options as CodeBlockWriterOptions } from "code-block-writer";

export interface CmsSchema extends JSONSchema4 {
  properties: {
    [k: string]: {
      type: "boolean" | "number" | "string";
    };
  };
  required: string[];
}

export interface MappableProp {
  name: string;
  type: "boolean" | "number" | "string";
  isRequired: boolean;
  description?: string;
}

export type MappedFields = [MappableProp, MappableProp][];

export type CodeGeneratorOptions = Partial<CodeBlockWriterOptions>;
