import { FunctionComponent } from "preact";

import Header from "./components/Header";
import { ComponentParserForm } from "./components/ComponentParserForm";
import { CmsSchemaForm } from "./components/CmsSchemaForm";
import { getComponentMappableProps } from "./utils";

const Main: FunctionComponent = () => {
  const appTitle = "CMS Adapter Generator";

  return (
    <div>
      <Header title={appTitle} />

      <div class="p-16 flex">
        <div class="flex-1 pr-8">
          <h3 class="mb-4 font-semibold text-lg">CMS</h3>
          <CmsSchemaForm />
        </div>

        <div class="flex-1 pl-8">
          <h3 class="mb-4 font-semibold text-lg">Component</h3>
          <ComponentParserForm
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
