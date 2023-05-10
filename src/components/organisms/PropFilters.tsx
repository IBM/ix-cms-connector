import { FunctionComponent } from "preact";

import { type MappableProp, filterByName } from "../../utils";
import { Checkbox } from "../atoms/Checkbox";

import { SearchInput } from "../atoms/SearchInput";

interface PropFiltersProps {
  propList: MappableProp[];
}

enum TypeFiltersEnum {
  String = "String",
  Boolean = "Boolean",
  Number = "Number",
}

// TODO: improve data structure so it can be made dynamic
const typeFilters = [
  TypeFiltersEnum.String,
  TypeFiltersEnum.Number,
  TypeFiltersEnum.String,
];

export const PropFilters: FunctionComponent<PropFiltersProps> = ({
  propList,
}) => {
  const getSearchText = (searchTerm: string) => {
    console.log("search text: ", searchTerm);

    const filter = filterByName(searchTerm, propList);

    console.log(filter);
  };

  return (
    <div>
      <SearchInput
        label=""
        placeholder="Filter properties"
        onSearchText={(text) => getSearchText(text)}
      />

      <div class="flex">
        {typeFilters.map((type, index) => (
          <Checkbox key={index} id={`${type}-${index}`} label={type} />
        ))}
      </div>
    </div>
  );
};
