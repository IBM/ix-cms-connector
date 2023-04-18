import { FunctionComponent } from "preact";
import { useState } from "preact/hooks";

import Header from "./components/Header";
import FileSelect from "./components/FileSelect";
import ComponentParser from "./components/ComponentParser";
import { CmsSchemaForm } from "./components/CmsSchemaForm";
import {
  MappableProp,
  getCmsMappableFields,
  getComponentMappableProps,
} from "./utils";
import { SchemaMatcher } from "./components/SchemaMatcher";

const Main: FunctionComponent = () => {
  const [componentFile, setComponentFile] = useState<File>();
  const [mappableCmsSchema, setMappableCmsSchema] = useState(
    [] as MappableProp[]
  );
  const [mappableComponentProps, setMappableComponentProps] = useState(
    [] as MappableProp[]
  );

  const appTitle = "CMS Adapter Generator";

  return (
    <div>
      <Header title={appTitle} />

      <div class="p-16 flex">
        <div class="flex-1 pl-8">
          <h3 class="mb-4 font-semibold text-lg">CMS</h3>
          <CmsSchemaForm
            onGenerate={(cmsSchema) => {
              const mappableCmsSchema = getCmsMappableFields(cmsSchema);
              setMappableCmsSchema(mappableCmsSchema);

              console.log(JSON.stringify(mappableCmsSchema, undefined, 2));
            }}
          />

          <h3 class="mb-4 font-semibold text-lg">Component</h3>
          <FileSelect onSelect={setComponentFile} />
          <ComponentParser
            file={componentFile}
            onParsed={(docs) => {
              if (docs) {
                const mappableComponentProps = getComponentMappableProps(docs);
                setMappableComponentProps(mappableComponentProps);

                console.log(
                  JSON.stringify(mappableComponentProps, undefined, 2)
                );
              }
            }}
          />

          <h3 class="mb-4 font-semibold text-lg">Schema Mapping</h3>
          <SchemaMatcher
            cmsSchema={mappableCmsSchema}
            componentProps={mappableComponentProps}
          />
        </div>
      </div>
    </div>
  );
};

export default Main;
