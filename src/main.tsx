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
      <div class="px-8 py-16 mx-auto max-w-7xl">
        <h1>IBM iX CMS Connector</h1>
        <p>
          A tool to connect a JSON schema from a CMS with the input props of UI
          components.
        </p>
      </div>

      <div class="border-t border-ui-03">
        <div class="px-8 py-16 mx-auto max-w-7xl grid grid-cols-2 gap-16">
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
      </div>

      {cmsSchema && componentDoc && (
        <div class="border-t border-ui-03">
          <div class="px-8 py-16 mx-auto max-w-7xl">
            <SchemaMatcher
              cmsSchema={cmsSchema}
              componentDoc={componentDoc}
              onGenerate={(mappedProps) => {
                setMappedProps(mappedProps);
              }}
            />
          </div>
        </div>
      )}

      {componentDoc && mappedProps?.length && (
        <div class="border-t border-ui-03">
          <div class="px-8 py-16 mx-auto max-w-7xl">
            <CodeGenerator
              componentDoc={componentDoc}
              mappedProps={mappedProps}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Main;
