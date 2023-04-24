import { FunctionComponent } from "preact";

import { ComponentParserForm } from "./components/ComponentParserForm";
import { CmsSchemaForm } from "./components/CmsSchemaForm";
import { Dropdown, DropdownOption } from "./components/atom/Dropdown";

const Main: FunctionComponent = () => {
  const [componentFile, setComponentFile] = useState<File>();
  const [selectedValue, setSelectedValue] = useState<DropdownOption>();

  const appTitle = "CMS Adapter Generator";

  const onItemSelected = (option: DropdownOption) => {
    setSelectedValue(option);
  };

  const [cmsSchema, setCmsSchema] = useState<CmsSchema>();
  const [componentDoc, setComponentDoc] = useState<Documentation>();

  return (
    <div class="bg-ui-shell-gray-10 h-full">
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
          <div class="w-[10rem]">
            <Dropdown
              handleOptionSelect={onItemSelected}
              label="Choose something"
              options={[
                { value: "one", label: "1" },
                { value: "two", label: "2" },
              ]}
              description="You should selected one element here"
              selected={selectedValue}
            ></Dropdown>
          </div>
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
