/*
 * Copyright 2020- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
import { type MappableProp, formatMappablePropType } from "../../utils";

export function getTypesFilterFromList(propList: MappableProp[]): string[] {
  const typesFilter: string[] = [];

  propList.forEach((prop) => {
    const [type] = formatMappablePropType(prop);

    if (!typesFilter.find((typeFilter) => typeFilter === type)) {
      typesFilter.push(type);
    }
  });

  return typesFilter;
}

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
    types.forEach((type) => {
      if (type === prop.type) result.push(prop);
    });
  });

  return result;
}

export function filterPropsList(
  name: string,
  types: string[],
  propList: MappableProp[]
): MappableProp[] {
  const filteredByName = filterByPropName(name, propList);
  return filterByPropType(types, filteredByName);
}
