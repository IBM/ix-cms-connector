/*
 * Copyright 2020- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */

import { FunctionComponent } from "preact";
import { useState } from "preact/hooks";
import { Button, ButtonType } from "./components/atoms/Button";
import { Dropdown, DropdownOption } from "./components/atoms/Dropdown";
import { Error } from "./components/atoms/Error";

import { Header } from "./components/atoms/Header";
import { Input } from "./components/atoms/Input";
import { RadioButton } from "./components/atoms/RadioButton";
import { SearchInput } from "./components/atoms/SearchInput";
import { Checkbox } from "./components/atoms/Checkbox";
import { FileSelect } from "./components/molecules/FileSelect";

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

  const onCheckboxSelected = () => {
    // Do nothing
  };

  return (
    <>
      <Header />
      <div class="px-8 py-16 mx-auto max-w-7xl">
        <h1>Components Overview</h1>

        <div class="mt-16 grid grid-cols-2 gap-8">
          <div class="flex flex-col gap-3 w-[200px]">
            <h3>Button Variation</h3>
            <Button style={ButtonType.PRIMARY} text="Button Primary" />
            <Button style={ButtonType.SECONDARY} text="Button Secondary" />
            <Button
              style={ButtonType.PRIMARY}
              disabled
              text="Button disabled"
            />
          </div>

          <div class="flex flex-col gap-3 w-[400px]">
            <h3>File whitout removing option</h3>
            <FileSelect onSelect={onSelect} />
            <h3>File with removing option</h3>
            <FileSelect onSelect={onSelect} onRemoveFile={onRemoveFile} />
          </div>

          <div class="flex flex-col gap-3 w-[400px]">
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
              placeholder="Select"
            />
          </div>

          <div class="flex flex-col gap-3 w-[400px]">
            <h3>Input</h3>
            <Input label="Input Label" placeholder="Placeholder" />
          </div>

          <div class="flex flex-col gap-3 w-[400px]">
            <h3>Search Input</h3>
            <SearchInput
              label="Search Input Label"
              placeholder="Placeholder"
              onSearchText={onSearchText}
            />
          </div>

          <div class="flex flex-col gap-3 w-[400px]">
            <h3>Error</h3>
            <Error>
              <p class="mb-0">
                No React component found in
                <span class="text-text-01"> foo.json</span>.
              </p>
            </Error>
          </div>

          <div class="flex flex-col gap-3 w-[400px]">
            <h3>Radio Button</h3>
            <h4>Select one item</h4>
            <div class="flex flex-row gap-3">
              <RadioButton label="Item 1" name="overview" />
              <RadioButton label="Item 2" name="overview" />
              <RadioButton label="Item 3" name="overview" />
            </div>
          </div>

          <div class="flex flex-col gap-3 w-[400px]">
            <h3>Checkbox</h3>
            <h4>Select as many items as you want</h4>
            <div class="flex flex-row gap-3">
              <Checkbox
                id="checkbox-1"
                label="Item 1"
                handleOptionSelect={onCheckboxSelected}
              />
              <Checkbox
                id="checkbox-2"
                label="Item 2"
                handleOptionSelect={onCheckboxSelected}
              />
              <Checkbox
                id="checkbox-3"
                label="Item 3"
                handleOptionSelect={onCheckboxSelected}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Overview;
