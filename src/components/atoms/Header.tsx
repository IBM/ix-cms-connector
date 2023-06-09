/*
 * Copyright 2020- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
import { FunctionComponent } from "preact";

export const Header: FunctionComponent = ({ children }) => {
  return (
    <header
      class="flex justify-start items-center bg-ui-05 p-4"
      data-testId="header-component"
    >
      <div class="text-xl text-text-04">
        IBM <strong>iX</strong>
      </div>
      {!!children && <div>{children}</div>}
    </header>
  );
};
