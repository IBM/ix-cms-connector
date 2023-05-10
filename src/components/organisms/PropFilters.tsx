import { FunctionComponent } from "preact";
import { useId } from "preact/hooks";

import { type MappableProp, filterByName } from "../../utils";
import { Checkbox } from "../atoms/Checkbox";

import { SearchInput } from "../atoms/SearchInput";

interface PropFiltersProps {
  propList: MappableProp[];
  customCss?: string;
}

enum TypeFiltersEnum {
  String = "String",
  Boolean = "Boolean",
  Number = "Number",
}

// TODO: improve data structure so it can be made dynamic
const typeFilters = [
  TypeFiltersEnum.String,
  TypeFiltersEnum.Boolean,
  TypeFiltersEnum.String,
];

export const PropFilters: FunctionComponent<PropFiltersProps> = ({
  propList,
  customCss,
}) => {
  const getSearchText = (searchTerm: string) => {
    console.log("search text: ", searchTerm);

    const filter = filterByName(searchTerm, propList);

    console.log(filter);
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
        {typeFilters.map((type, index) => (
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
