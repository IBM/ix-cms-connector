import { FunctionComponent } from "preact";

/* Example of function component */
const MainHeader: FunctionComponent<{title: string}> = ({title /*, children*/}) => {
  return (
    <header class="text-center py-2 bg-slate-200 mb-4">
      <h1 class="text-2xl">LIT</h1>
      <h2>{title}</h2>
    </header>
  );
} ;

export default MainHeader;