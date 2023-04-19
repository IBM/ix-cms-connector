import { FunctionComponent } from "preact";

import Header from "./components/Header";
import { ComponentParserForm } from "./components/ComponentParserForm";
import { CmsSchemaForm } from "./components/CmsSchemaForm";
import { CmsSchema } from "./utils";
import { useState } from "preact/hooks";
import { Documentation } from "react-docgen";
import { SchemaMatcher } from "./components/SchemaMatcher";

const Main: FunctionComponent = () => {
  const appTitle = "CMS Adapter Generator";

  const [cmsSchema, setCmsSchema] = useState<CmsSchema>();
  const [componentDoc, setComponentDoc] = useState<Documentation>();

  return (
    <div class="p-16">
      <Header title={appTitle} />

      <div class="grid grid-cols-2 gap-4 mb-8">
        <div>
          <h3 class="mb-4 font-semibold text-lg">CMS</h3>
          <CmsSchemaForm
            onGenerate={(cmsSchema) => {
              setCmsSchema(cmsSchema);
            }}
          />
        </div>

        <div>
          <h3 class="mb-4 font-semibold text-lg">Component</h3>
          <ComponentParserForm
            onParsed={(doc) => {
              setComponentDoc(doc);
            }}
          />
        </div>
      </div>

      {cmsSchema && componentDoc && (
        <div class="mb-8">
          <h3 class="mb-4 font-semibold text-lg">Schema Mapping</h3>
          <SchemaMatcher cmsSchema={cmsSchema} componentDoc={componentDoc} />
        </div>
      )}
    </div>
  );
};

export default Main;
