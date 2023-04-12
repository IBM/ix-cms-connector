import { FunctionComponent } from "preact";
import { useState } from "preact/hooks";

import Header from "./components/Header";
import FileSelect from "./components/FileSelect";
import Parser from "./components/Parser";

const Main: FunctionComponent = () => {
  const [file, setFile] = useState<File>();

  const appTitle = "CMS Adapter Generator";

  return (
    <div>
      <Header title={appTitle} />

      <div class="p-16 flex">
        <div class="flex-1 pr-8"></div>
        <div class="flex-1 pl-8">
          <h3 class="mb-4 font-semibold text-lg">Component</h3>

          <FileSelect onSelect={setFile} />
          <Parser file={file} />
        </div>
      </div>
    </div>
  );
};

export default Main;
