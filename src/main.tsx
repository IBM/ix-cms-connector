import { FunctionComponent } from "preact";
import { useState } from "preact/hooks";
import { Documentation } from "react-docgen";

import { ComponentParserForm } from "./components/ComponentParserForm";
import { CmsSchemaForm } from "./components/CmsSchemaForm";
import { Dropdown, DropdownOption } from "./components/atom/Dropdown";
import { SchemaMatcher } from "./components/SchemaMatcher";
import { Header } from "./components/atom/Header";
import { CodeGenerator } from "./components/organisms/CodeGenerator";
import { CmsSchema, MappedFields } from "./utils";
import { SearchInput } from "./components/atom/SearchInput";

const Main: FunctionComponent = () => {
  const [selectedValue, setSelectedValue] = useState<DropdownOption>();
  const [cmsSchema, setCmsSchema] = useState<CmsSchema>();
  const [componentDoc, setComponentDoc] = useState<Documentation>();
  const [mappedFields, setMappedFields] = useState<MappedFields>();

  const appTitle = "CMS Adapter Generator";

  const onItemSelected = (option: DropdownOption) => {
    setSelectedValue(option);
  };

  return (
    <>
      <Header />
      <div class="px-4 mt-16 mx-auto max-w-7xl">
        <h1>CMS Adapter Generator</h1>
        <p>Description ...</p>
      </div>

      <div class="px-4 my-16 mx-auto max-w-7xl grid grid-cols-2 gap-8">
        <div>
          <h3>CMS</h3>
          <CmsSchemaForm
            onGenerate={(cmsSchema) => {
              setCmsSchema(cmsSchema);
            }}
          />
        </div>

        <div>
          <h3>Component</h3>
          <ComponentParserForm
            onParsed={(doc) => {
              setComponentDoc(doc);
            }}
          />
          <div class="w-[10rem]">
            <SearchInput
              onSearchText={(term: string) => {
                alert(term);
              }}
              label="test"
              placeholder="Search"
            />
          </div>
        </div>
      </div>

      {cmsSchema && componentDoc && (
        <div class="px-4 my-16 mx-auto max-w-7xl">
          <h3>Schema Mapping</h3>
          <SchemaMatcher
            cmsSchema={cmsSchema}
            componentDoc={componentDoc}
            onGenerate={(mappedFields) => {
              setMappedFields(mappedFields);
            }}
          />
        </div>
      )}

      {componentDoc && mappedFields?.length && (
        <div class="px-4 my-16 mx-auto max-w-7xl">
          <CodeGenerator
            componentDoc={componentDoc}
            mappedFields={mappedFields}
          />
        </div>
      )}
    </>
  );
};

export default Main;
