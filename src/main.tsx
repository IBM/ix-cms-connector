import { FunctionComponent } from "preact";

import Header from "./components/Header";
import { ComponentParserForm } from "./components/ComponentParserForm";
import { CmsSchemaForm } from "./components/CmsSchemaForm";
import { CmsSchema } from "./utils";
import { PropsMapper } from "./components/PropsMapper";
import { useState } from "preact/hooks";
import { Documentation } from "react-docgen";

const Main: FunctionComponent = () => {
  const appTitle = "CMS Adapter Generator";

  const [cmsSchema, setCmsSchema] = useState<CmsSchema>();
  const [componentDoc, setComponentDoc] = useState<Documentation>();

  return (
    <div class="p-16">
      <Header title={appTitle} />

      {(!cmsSchema || !componentDoc) && (
        <div class="flex">
          <div class="flex-1 pr-8">
            <h3 class="mb-4 font-semibold text-lg">CMS</h3>
            <CmsSchemaForm
              onParsed={(cmsSchema) => {
                if (cmsSchema) {
                  setCmsSchema(cmsSchema);
                }
              }}
            />
          </div>

          <div class="flex-1 pl-8">
            <h3 class="mb-4 font-semibold text-lg">Component</h3>
            <ComponentParserForm
              onParsed={(doc) => {
                if (doc) {
                  setComponentDoc(doc);
                }
              }}
            />
          </div>
        </div>
      )}

      {cmsSchema && componentDoc && (
        <PropsMapper cmsSchema={cmsSchema} componentDoc={componentDoc} />
      )}
    </div>
  );
};

export default Main;
