/*
 * Copyright 2020- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
import { FunctionComponent } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";

import { type MappableProp, filterPropsList } from "../../utils";
import { Checkbox } from "../atoms/Checkbox";

import { SearchInput } from "../atoms/SearchInput";

interface PropertyFiltersProps {
  list: MappableProp[];
  types: string[];
  onPropertiesFiltered: (listProps: MappableProp[]) => void;
  alignRight?: boolean;
}

export const PropertyFilters: FunctionComponent<PropertyFiltersProps> = ({
  list,
  types,
  onPropertiesFiltered,
  alignRight,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [typesFilter, setTypesFilter] = useState<string[]>([]);

  const memoizedCheckboxes = () =>
    useMemo(() => {
      return types.map((t) => {
        const newId = Math.floor(Math.random() * 1000);
        const typeFound = list.some((item) => t === item.type);

        return (
          <Checkbox
            key={newId}
            id={newId.toString()}
            label={t}
            defaultChecked={typeFound ? true : false}
            disabled={!typeFound}
            handleOptionSelect={(val) => onItemChecked(val, t)}
          />
        );
      });
    }, [types]);

  const onItemChecked = (isSelected: boolean, filterType: string) => {
    setTypesFilter((prevState) => {
      let newState: string[] = [];

      if (!isSelected) {
        newState = prevState.filter((val) => val !== filterType);
      } else {
        newState = [...prevState, filterType];
      }

      return newState;
    });
  };

  useEffect(() => {
    // If the CMS or component props change,
    // reset the search input field
    setSearchTerm("");
  }, [list]);

  useEffect(() => {
    setTypesFilter(types);
  }, [types]);

  useEffect(() => {
    const searchResult = filterPropsList(searchTerm, typesFilter, list);
    onPropertiesFiltered(searchResult);
  }, [searchTerm, typesFilter, list]);

  return (
    <div class={`flex flex-col mb-8 w-2/3 ${alignRight ? "self-end" : ""}`}>
      <SearchInput
        label=""
        placeholder="Filter properties"
        onSearchText={(text) => setSearchTerm(text)}
        value={searchTerm}
      />

      <div class={`flex flex-wrap mt-2 gap-4 ${alignRight ? "self-end" : ""}`}>
        {memoizedCheckboxes()}
      </div>
    </div>
  );
};
