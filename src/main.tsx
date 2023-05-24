import { FunctionComponent } from "preact";
import { useState } from "preact/hooks";
import { Documentation } from "react-docgen";

import { ComponentParserForm } from "./components/organisms/ComponentParserForm";
import { CmsSchemaForm } from "./components/organisms/CmsSchemaForm";
import { SchemaMatcher } from "./components/organisms/SchemaMatcher";
import { Header } from "./components/atoms/Header";
import { CodeGenerator } from "./components/organisms/CodeGenerator";
import type { JSONSchema, MappedProps } from "./utils";

const Main: FunctionComponent = () => {
  const [cmsSchema, setCmsSchema] = useState<JSONSchema>();
  const [componentDoc, setComponentDoc] = useState<Documentation>();
  const [mappedProps, setMappedProps] = useState<MappedProps>();

  return (
    <>
      <Header />
      <div class="px-4 mt-16 mx-auto max-w-7xl">
        <h1>CMS Adapter Generator</h1>
        <p>Description ...</p>
      </div>

      <div class="px-4 my-16 mx-auto max-w-7xl grid grid-cols-2 gap-8">
        <div>
          <h3>JSON Schema</h3>
          <p>Provide a schema to map data from.</p>
          <CmsSchemaForm
            onGenerate={(cmsSchema) => {
              setCmsSchema(cmsSchema);
            }}
          />
        </div>

        <div>
          <h3>React component</h3>
          <p>Upload the React component to be mapped.</p>
          <ComponentParserForm
            onParsed={(doc) => {
              setComponentDoc(doc);
            }}
          />
        </div>
      </div>

      {cmsSchema && componentDoc && (
        <div class="px-4 my-16 pt-16 mx-auto max-w-7xl border-t border-ui-03">
          <SchemaMatcher
            cmsSchema={cmsSchema}
            componentDoc={componentDoc}
            onGenerate={(mappedProps) => {
              setMappedProps(mappedProps);
            }}
          />
        </div>
      )}

      {componentDoc && mappedProps?.length && (
        <div class="px-4 my-16 mx-auto max-w-7xl">
          <CodeGenerator
            componentDoc={componentDoc}
            mappedProps={mappedProps}
          />
        </div>
      )}
    </>
  );
};

export default Main;
