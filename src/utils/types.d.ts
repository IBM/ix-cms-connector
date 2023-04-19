import { JSONSchema4 } from "json-schema";

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
