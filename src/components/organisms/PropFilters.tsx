import { FunctionComponent } from "preact";

import { type MappableProp, filterByName } from "../../utils";
import { Checkbox } from "../atoms/Checkbox";

import { SearchInput } from "../atoms/SearchInput";

interface PropFiltersProps {
  propList: MappableProp[];
}

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
      <Checkbox id="example-1" label="Example" />
    </div>
  );
};
