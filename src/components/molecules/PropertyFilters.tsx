import { FunctionComponent } from "preact";
import { useId, useEffect, useMemo, useState } from "preact/hooks";

import {
  type MappableProp,
  filterPropsList,
  getTypesFilterFromList,
} from "../../utils";
import { Checkbox } from "../atoms/Checkbox";

import { SearchInput } from "../atoms/SearchInput";

interface PropertyFiltersProps {
  list: MappableProp[];
  onPropertiesFiltered: (listProps: MappableProp[]) => void;
  alignRight?: boolean;
}

export const PropertyFilters: FunctionComponent<PropertyFiltersProps> = ({
  list,
  onPropertiesFiltered,
  alignRight,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [typesFilter, setTypesFilter] = useState<string[]>([]);

  const checkboxTypes: string[] = useMemo(() => {
    const typesFilter = getTypesFilterFromList(list);
    setTypesFilter(typesFilter);
    return typesFilter;
  }, list);

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
        {checkboxTypes.map((type, index) => (
          <Checkbox
            key={index}
            id={useId()}
            label={type}
            checked={true}
            handleOptionSelect={(isSelected) => onItemChecked(isSelected, type)}
          />
        ))}
      </div>
    </div>
  );
};
