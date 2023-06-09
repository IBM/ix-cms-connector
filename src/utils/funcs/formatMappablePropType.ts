/*
 * Copyright 2020- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
import { TSType } from "../const";
import type { MappableProp } from "../types";

export function formatMappablePropType({
  type,
  subTypes,
}: MappableProp): string[] {
  const propTypes = [];
  if (type === TSType.Array) {
    for (const subType of subTypes) {
      propTypes.push(`${subType}[]`);
    }
  } else if (type === TSType.Union) {
    for (const subType of subTypes) {
      propTypes.push(subType);
    }
  } else {
    propTypes.push(type);
  }
  return propTypes;
}
