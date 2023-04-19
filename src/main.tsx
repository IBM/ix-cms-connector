import { FunctionComponent } from "preact";
import { useState } from "preact/hooks";

import Header from "./components/Header";
import FileSelect from "./components/FileSelect";
import ComponentParser from "./components/ComponentParser";
import { CmsSchemaForm } from "./components/CmsSchemaForm";
import { getComponentMappableProps, generateAdapterCode } from "./utils";

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

      <div class="mt-16 font-mono whitespace-pre p-4 rounded border-2 border-gray-200 bg-gray-50 max-h-96 text-sm overflow-scroll text-gray-900">
        {generateAdapterCode({ displayName: "Button" }, [
          [
            { name: "name", type: "string", isRequired: true },
            { name: "label", type: "string", isRequired: true },
          ],
          [
            { name: "isActive", type: "boolean", isRequired: true },
            { name: "isActive", type: "boolean", isRequired: true },
          ],
        ])}
      </div>
    </div>
  );
};

export default Main;
