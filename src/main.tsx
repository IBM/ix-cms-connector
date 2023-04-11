import { FunctionComponent } from "preact";

import Header from "./components/Header/Header";

const Main: FunctionComponent = () => {
  const appTitle = "CMS Adapter Generator";

  return (
    <div>
      <Header title={appTitle} />
      <div class="mx-4">
        <p class="text-amber-900">Hello!</p>
      </div>
    </div>
  );
};

export default Main;
