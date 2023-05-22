import { FunctionComponent } from "preact";
import { useId, useEffect, useMemo, useState } from "preact/hooks";

import {
  type MappableProp,
  filterByName,
  filterByPropType,
  formatMappablePropType,
} from "../../utils";
import { Checkbox } from "../atoms/Checkbox";

import { SearchInput } from "../atoms/SearchInput";

interface PropertyFiltersProps {
  list: MappableProp[];
  onPropertiesFiltered: (listProps: MappableProp[]) => void;
  customCss?: string;
}

export const PropertyFilters: FunctionComponent<PropertyFiltersProps> = ({
  list,
  onPropertiesFiltered,
  customCss,
}) => {
  const [filteredList, setFilteredList] = useState<MappableProp[]>([]);
  const [checkboxFilters, setCheckboxFilters] = useState<string[]>([]);

  const checkboxTypes: string[] = useMemo(() => {
    const propListTypes = list.map((listItem) => {
      const [type] = formatMappablePropType(listItem);
      return type;
    });

    const cleanedTypes: string[] = [];

    propListTypes.forEach((pType) => {
      if (!cleanedTypes.find((cType) => cType === pType)) {
        cleanedTypes.push(pType);
      }
    });

    return cleanedTypes;
  }, list);

  const getSearchText = (searchTerm: string) => {
    if (searchTerm.trim() === "") {
      setFilteredList(list);
      onPropertiesFiltered(list);
      return;
    }

    const result = filterByName(searchTerm, filteredList);
    setFilteredList(result);
    onPropertiesFiltered(result);
  };

  const onItemChecked = (isSelected: boolean, filterType: string) => {
    console.log("checked: ", filterType, isSelected);

    setCheckboxFilters((prevState) => {
      console.log("========= prevState: ", prevState);

      // TODO: if checkbox is selected => remove from state
      // TODO: IF CHECKBOX IS selected => add to state
      // check if it makes sense to use reducer

      const newState = [...prevState, filterType];

      console.log("========= newState: ", newState);

      const result = filterByPropType(newState, list);
      setFilteredList(result);
      onPropertiesFiltered(result);

      return newState;
    });
  };

  useEffect(() => {
    setFilteredList(list);
  }, [list]);

  useEffect(() => {
    console.log("checkboxFilters: ", checkboxFilters);
  }, [checkboxFilters]);

  return (
    <div class={customCss}>
      <SearchInput
        label=""
        placeholder="Filter properties"
        onSearchText={(text) => getSearchText(text)}
      />

      <div class="flex">
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
