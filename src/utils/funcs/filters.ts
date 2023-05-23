import type { MappableProp } from "../types";

export function filterByPropName(
  name: string,
  propList: MappableProp[]
): MappableProp[] {
  return propList.filter((item) => item.name.toLowerCase().match(name));
}

export function filterByPropType(
  types: string[],
  propList: MappableProp[]
): MappableProp[] {
  const result: MappableProp[] = [];

  propList.forEach((prop) => {
    let filterMatch = false;

    types.forEach((type) => {
      if (type === prop.type) filterMatch = true;
    });

    if (!filterMatch) {
      result.push(prop);
    }
  });

  return result;
}

export function filterPropsList(
  name: string,
  types: string[],
  propList: MappableProp[]
) {
  //do something
}
