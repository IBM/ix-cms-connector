import { FunctionComponent } from "preact";

// Husky test

/* Example of function component */
export const MainHeader: FunctionComponent<{ title: string }> = ({
  title /*, children*/,
}) => {
  return (
    <header class="text-center py-2 bg-slate-200 mb-4">
      <h1 class="text-2xl">LIT</h1>
      <h2>{title}</h2>
    </header>
  );
};
