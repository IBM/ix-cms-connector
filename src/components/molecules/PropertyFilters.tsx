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
  defaultVal?: boolean;
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
    const filters: checkboxFilter[] = [];

    types.forEach((t) => {
      if (list.some((item) => t === item.type)) {
        filters.push({ label: t, defaultVal: true, isDisabled: false });
      } else {
        filters.push({ label: t, isDisabled: true });
      }
    });

    return filters;
  }, [types]);

  const memoizedCheckboxes = () =>
    useMemo(() => {
      return checkboxFilters.map(({ label, defaultVal, isDisabled }, index) => (
        <Checkbox
          key={index}
          id={useId()}
          label={label}
          defaultChecked={defaultVal}
          disabled={isDisabled}
          handleOptionSelect={(val) => onItemChecked(val, label)}
        />
      ));
    }, [checkboxFilters]);

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
  }, [searchTerm, typesFilter]);

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
