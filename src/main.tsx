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

      <div class="mx-auto max-w-7xl px-4 my-12">
        <div class="p-4">
          <h1>IBM iX CMS Connector</h1>
          <p>
            A tool that helps create a connector function (HOC) between a CMS
            schema and a react component.
          </p>
        </div>
      </div>

      <div class="border-t border-ui-03">
        <div class="mx-auto max-w-7xl px-4 my-12">
          <div class="grid grid-cols-2">
            <div class="p-4">
              <h3>JSON Schema</h3>
              <p>Provide a schema to map data from.</p>
              <CmsSchemaForm
                onGenerate={(cmsSchema) => {
                  setCmsSchema(cmsSchema);
                }}
              />
            </div>

            <div class="p-4">
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
      </div>

      {cmsSchema && componentDoc && (
        <div class="border-t border-ui-03">
          <div class="mx-auto max-w-7xl px-4 my-12">
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
          <div class="mx-auto max-w-7xl px-4 my-12">
            <div class="p-4">
              <CodeGenerator
                componentDoc={componentDoc}
                mappedProps={mappedProps}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Main;
