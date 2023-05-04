import { FunctionComponent } from "preact";

import { type MappableProp, filterByName } from "../../utils";

import { SearchInput } from "../atom/SearchInput";

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
    <SearchInput
      label=""
      placeholder="Filter properties"
      onSearchText={(text) => getSearchText(text)}
    />
  );
};
