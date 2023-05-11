import type { MappableProp } from "../types";
import { getMappablePropTypeSignature } from "./generateAdapterCode";

export function formatMappablePropType(mappableProp: MappableProp) {
  // todo: change it to the desired format when the UI is ready
  return getMappablePropTypeSignature(mappableProp);
}
