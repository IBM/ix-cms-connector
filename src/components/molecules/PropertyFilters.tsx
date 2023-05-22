import { FunctionComponent } from "preact";
import { useId, useMemo } from "preact/hooks";

import {
  type MappableProp,
  filterByName,
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
    const filter = filterByName(searchTerm, list);
    onPropertiesFiltered(filter);
  };

  const onItemChecked = () => {
    console.log("checked");
  };

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
            handleOptionSelect={onItemChecked}
          />
        ))}
      </div>
    </div>
  );
};
