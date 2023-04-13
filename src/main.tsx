import { FunctionComponent } from "preact";
import { useState } from "preact/hooks";

import Header from "./components/Header";
import FileSelect from "./components/FileSelect";
import ComponentParser from "./components/ComponentParser";
import { Input } from "./components/Input";
import { Button } from "./components/Button";
import { getSchema } from "../generate-schema";

const Main: FunctionComponent = () => {
  const [componentFile, setComponentFile] = useState<File>();

  const appTitle = "CMS Adapter Generator";

  const generateCmsSchema= (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const { cmsEndpoint } = Object.fromEntries(formData.entries());

    getSchema(cmsEndpoint)
  }

  return (
    <div>
      <Header title={appTitle} />

      <div class="p-16 flex">
      <div class="flex-1 pl-8">
        <h3 class="mb-4 font-semibold text-lg">CMS</h3>
          <form onSubmit={generateCmsSchema}>
            <Input label='Your CMS api endpoint' name='cmsEndpoint' />
            <Button text='Get CMS schema' type='submit'/>
          </form>
        </div>
      </div>

      <div class="p-16 flex">
        

        <div class="flex-1 pl-8">
          <h3 class="mb-4 font-semibold text-lg">Component</h3>

          <FileSelect onSelect={setComponentFile} />
          <ComponentParser file={componentFile} />
        </div>
      </div>
    </div>
  );
};

export default Main;
