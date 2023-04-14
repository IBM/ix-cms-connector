import { FunctionComponent } from "preact";
import { useState } from "preact/hooks";

import Header from "./components/Header";
import FileSelect from "./components/FileSelect";
import ComponentParser from "./components/ComponentParser";
import { CmsSchemaForm } from "./components/CmsSchemaForm";
import { getComponentMappableProps } from "./utils";

const Main: FunctionComponent = () => {
  const [componentFile, setComponentFile] = useState<File>();

  const appTitle = "CMS Adapter Generator";

  return (
    <div>
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
        </div>
      </div>
    </div>
  );
};

export default Main;
