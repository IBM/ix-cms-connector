import { FunctionComponent } from "preact";
import { useState } from "preact/hooks";

import Header from "./components/Header/Header";
import FileSelect from "./components/FileSelect";
import Parser from "./components/Parser";

const Main: FunctionComponent = () => {
  const [file, setFile] = useState<File>();

  const appTitle = "CMS Adapter Generator";

  return (
    <div>
      <Header title={appTitle} />
      <section class="p-32">
        <FileSelect onSelect={setFile} />
        <Parser file={file} />
      </section>
    </div>
  );
};

export default Main;
