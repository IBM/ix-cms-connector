/*
 * Copyright 2020- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
import { FunctionComponent } from "preact";

interface ClickableListProps {
  listCollection: object[];
  mappedKey: string;
  mappedSubKey?: string;
  onItemClick?: (name: string) => void;
}

export const ClickableList: FunctionComponent<ClickableListProps> = ({
  listCollection,
  mappedKey,
  mappedSubKey,
  onItemClick,
}) => (
  <ul>
    {listCollection.map((item) => {
      const mappedItemKey = item[mappedKey];
      return (
        <li
          key={mappedItemKey}
          class="cursor-pointer"
          onClick={() => onItemClick(mappedItemKey)}
        >
          {mappedItemKey}
          <div class="text-xs">{item[mappedSubKey]}</div>
        </li>
      );
    })}
  </ul>
);
