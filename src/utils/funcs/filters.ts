import type { MappableProp } from "../types";

export function filterByName(searchTerm: string, propList: MappableProp[]) {
  return propList.filter((item) => item.name.match(searchTerm));
}

export function filterByPropType(
  checkboxFilters: string[],
  propList: MappableProp[]
) {
  const newList: MappableProp[] = [];

  propList.forEach((prop) => {
    let filterMatch = false;

    checkboxFilters.forEach((checkbox) => {
      if (checkbox === prop.type) filterMatch = true;
    });

    if (!filterMatch) {
      newList.push(prop);
    }
  });

  console.log("new list: ", newList);

  return newList;
}
