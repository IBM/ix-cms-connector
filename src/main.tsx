import { FunctionComponent } from "preact";
import { useState } from "preact/hooks";

import { MainHeader as Header } from "./components/Header";
import { FileSelect } from "./components/FileSelect";
import { ComponentParser } from "./components/ComponentParser";
import { getComponentMappableProps } from "./utils/funcs";
import { CmsSchemaForm } from "./components/CmsSchemaForm";
import { Dropdown, DropdownOption } from "./components/atom/dropdown";

const Main: FunctionComponent = () => {
  const [componentFile, setComponentFile] = useState<File>();

  const appTitle = "CMS Adapter Generator";

  const onItemSelected = (option: DropdownOption) => {
    alert(option.label);
  };

  return (
    <div class="bg-ui-shell-gray-10 h-full">
      <Header title={appTitle} />

      <div class="p-16 flex">
        <div class="flex-1 pl-8">
          <h3 class="mb-4 font-semibold text-lg">CMS</h3>
          <CmsSchemaForm />
        </div>
      </div>

      <div class="p-16 flex">
        <div class="flex-1 pl-8">
          <h3 class="mb-4 font-semibold text-lg">Component</h3>
          <FileSelect onSelect={setComponentFile} />
          <ComponentParser
            file={componentFile}
            onParsed={(docs) => {
              if (docs) {
                console.log(
                  JSON.stringify(getComponentMappableProps(docs), undefined, 2)
                );
              }
            }}
          />
          <Dropdown
            handleOptionSelect={onItemSelected}
            label="Choose something"
            customOptions={[
              { value: "one", label: "1" },
              { value: "two", label: "2" },
            ]}
          ></Dropdown>
        </div>
      </div>
    </div>
  );
};

export default Main;
