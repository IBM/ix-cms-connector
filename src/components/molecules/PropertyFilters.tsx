/*
 * Copyright 2020- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
import { FunctionComponent } from "preact";
import { useId, useEffect, useMemo, useState } from "preact/hooks";

import { type MappableProp, filterPropsList } from "../../utils";
import { Checkbox } from "../atoms/Checkbox";

import { SearchInput } from "../atoms/SearchInput";

interface PropertyFiltersProps {
  list: MappableProp[];
  types: string[];
  onPropertiesFiltered: (listProps: MappableProp[]) => void;
  alignRight?: boolean;
}

type checkboxFilter = {
  label: string;
  isDisabled: boolean;
};

export const PropertyFilters: FunctionComponent<PropertyFiltersProps> = ({
  list,
  types,
  onPropertiesFiltered,
  alignRight,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [typesFilter, setTypesFilter] = useState<string[]>([]);

  const checkboxFilters: checkboxFilter[] = useMemo(() => {
    console.log("PropertyFilters - checkboxTypes");

    const filters: checkboxFilter[] = [];

    types.forEach((t) => {
      if (list.some((item) => t === item.type)) {
        filters.push({ label: t, isDisabled: false });
      } else {
        filters.push({ label: t, isDisabled: true });
      }
    });

    return filters;
  }, [list]);

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
    console.log("property filters: set filter types");
    setTypesFilter(types);
  }, [types]);

  useEffect(() => {
    const searchResult = filterPropsList(searchTerm, typesFilter, list);
    onPropertiesFiltered(searchResult);
  }, [searchTerm, typesFilter]);

  return (
    <div class={`flex flex-col mb-8 w-2/3 ${alignRight ? "self-end" : ""}`}>
      <SearchInput
        label=""
        placeholder="Filter properties"
        onSearchText={(text) => setSearchTerm(text)}
      />

      <div class={`flex flex-wrap mt-2 gap-4 ${alignRight ? "self-end" : ""}`}>
        {checkboxFilters.map((checkboxItem, index) => (
          <Checkbox
            key={index}
            id={useId()}
            label={checkboxItem.label}
            checked={true}
            disabled={checkboxItem.isDisabled}
            handleOptionSelect={(isSelected) =>
              onItemChecked(isSelected, checkboxItem.label)
            }
          />
        ))}
      </div>
    </div>
  );
};
