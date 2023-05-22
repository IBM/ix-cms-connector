import type { MappableProp } from "../types";

export function filterByName(searchTerm: string, propList: MappableProp[]) {
  return propList.filter((item) => item.name.match(searchTerm));
}

export function filterByPropType(
  checkboxFilters: string[],
  propList: MappableProp[]
) {
  console.log("propList: ", propList);

  const newList: MappableProp[] = propList.filter((prop) => {
    console.log("prop: ", prop);

    return checkboxFilters.find((checkbox) => checkbox !== prop.type);
  });

  console.log("new list: ", newList);

  return newList;
}
