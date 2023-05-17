import type { MappableProp } from "../types";

export function filterByName(searchTerm: string, propList: MappableProp[]) {
  return propList.filter((item) => item.name.match(searchTerm));
}
