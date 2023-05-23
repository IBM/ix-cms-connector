import { FunctionComponent } from "preact";
import { useId, useEffect, useMemo, useState } from "preact/hooks";

import {
  type MappableProp,
  filterPropsList,
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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [typesFilter, setTypesFilter] = useState<string[]>([]);

  // TODO: CLEANUP
  // const [filteredList, setFilteredList] = useState<MappableProp[]>([]);

  // TODO: RESET FILTERS IF COMPONENT CHANGES

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

    setTypesFilter(cleanedTypes);

    return cleanedTypes;
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

  // useEffect(() => {
  //   setFilteredList(list);
  // }, [list]);

  useEffect(() => {
    const searchResult = filterPropsList(searchTerm, typesFilter, list);
    onPropertiesFiltered(searchResult);
  }, [searchTerm, typesFilter]);

  return (
    <div class={customCss}>
      <SearchInput
        label=""
        placeholder="Filter properties"
        onSearchText={(text) => setSearchTerm(text)}
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
