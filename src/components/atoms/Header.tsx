import { FunctionComponent } from "preact";

export const Header: FunctionComponent = ({ children }) => {
  return (
    <header
      class="flex justify-start items-center bg-ui-05 px-2"
      data-testId="header-component"
    >
      <div class="text-xl text-text-04 p-2">
        IBM <strong>iX</strong>
      </div>
      {!!children && <div>{children}</div>}
    </header>
  );
};
