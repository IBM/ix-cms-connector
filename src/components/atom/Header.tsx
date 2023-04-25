import { FunctionComponent } from "preact";

/* Example of function component */
export const Header: FunctionComponent = ({ children }) => {
  return (
    <header class="flex justify-start items-center bg-ui-05 px-2">
      <div class="text-xl text-text-04 p-2">
        IBM <strong>iX</strong>
      </div>
      {!!children && <div>{children}</div>}
    </header>
  );
};
