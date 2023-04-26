import { FunctionComponent } from "preact";
import { useState } from "preact/hooks";
import { Button, ButtonType } from "./components/atom/button";
import { Dropdown, DropdownOption } from "./components/atom/Dropdown";

import { Header } from "./components/atom/Header";
import { Input } from "./components/atom/input";
import { RadioButton } from "./components/atom/RadioButton";
import { SearchInput } from "./components/atom/SearchInput";
import { FileSelect } from "./components/molecule/FileSelect";

const Overview: FunctionComponent = () => {
  const [selected, setSelected] = useState<DropdownOption>();

  const onItemSelected = (option: DropdownOption) => {
    setSelected(option);
  };

  const onSearchText = (term: string) => {
    console.log(term);
  };

  const onSelect = () => {
    console.log("File selected");
  };

  const onRemoveFile = () => {
    console.log("File removed");
  };

  return (
    <>
      <Header />
      <div class="px-4 mt-16 mx-auto max-w-7xl">
        <h1>Components Overview</h1>
        <div class="px-4 my-16 mx-auto max-w-7xl grid grid-cols-2 gap-8">
          <div class="flex flex-col gap-3 w-[200px] mb-6">
            <h3>Button Variation</h3>
            <Button style={ButtonType.PRIMARY} text="Button Primary" />
            <Button style={ButtonType.SECONDARY} text="Button Secondary" />
            <Button
              style={ButtonType.PRIMARY}
              disabled
              text="Button disabled"
            />
          </div>
          <div class="flex flex-col gap-3 w-[400px] mb-6">
            <h3>File whitout removing option</h3>
            <FileSelect onSelect={onSelect} />
            <h3>File with removing option</h3>
            <FileSelect onSelect={onSelect} onRemoveFile={onRemoveFile} />
          </div>
          <div class="flex flex-col gap-3 w-[400px] mb-6">
            <h3>Dropdown</h3>
            <Dropdown
              selected={selected}
              label="Example dropdown label"
              description="Here is the description"
              options={[
                { label: "Option 1", value: "1" },
                { label: "Option 2", value: "2" },
                { label: "Option 3", value: "3" },
              ]}
              handleOptionSelect={onItemSelected}
            />
          </div>
          <div class="flex flex-col gap-3 w-[400px] mb-6">
            <h3>Input</h3>
            <Input label="Input Label" placeholder="Placeholder" />
          </div>
          <div class="flex flex-col gap-3 w-[400px] mb-6">
            <h3>Search Input</h3>
            <SearchInput
              label="Search Input Label"
              placeholder="Placeholder"
              onSearchText={onSearchText}
            />
          </div>
          <div class="flex flex-col gap-3 w-[400px] mb-6">
            <h3>Radio Button</h3>
            <h4>Select one item</h4>
            <div class="flex flex-row gap-3">
              <RadioButton label="Item 1" name="overview" />
              <RadioButton label="Item 2" name="overview" />
              <RadioButton label="Item 3" name="overview" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Overview;
