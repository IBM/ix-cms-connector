import { FunctionComponent } from "preact";
import { useState } from "preact/hooks";

import Header from "./components/Header";
import FileSelect from "./components/FileSelect";
import ComponentParser from "./components/ComponentParser";
import { Input } from "./components/Input";
import { Button } from "./components/Button";
import { Error } from "./components/Error";
import { getSchema } from "../generate-schema";

const Main: FunctionComponent = () => {
  const [cmsSchema, setCmsSchema] = useState<string>('');
  const [cmsError, setCmsError] = useState<string>('');
  const [componentFile, setComponentFile] = useState<File>();

  const appTitle = "CMS Adapter Generator";

  const generateCmsSchema= async(e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const { cmsEndpoint } = Object.fromEntries(formData.entries());
    console.log(cmsEndpoint)

    try {
      setCmsSchema( JSON.stringify(await getSchema(cmsEndpoint), undefined, 2) );
    }
    catch(err) {
      setCmsError( JSON.stringify(err, undefined, 2) );
    }
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
          {cmsError && (
            <Error error={cmsError}/>
          )}
          {!cmsError && cmsSchema && (
            <div class="font-mono whitespace-pre p-4 rounded border-2 border-emerald-200 bg-emerald-50 max-h-96 text-sm overflow-scroll text-emerald-600">
              {cmsSchema}
            </div>
          )}
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
