export interface MappableProp {
  name: string;
  type: "boolean" | "number" | "string";
  isRequired: boolean;
  description?: string;
}
