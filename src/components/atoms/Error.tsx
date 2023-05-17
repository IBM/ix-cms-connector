import { FunctionalComponent } from "preact";
import { WarningAltFilled } from "@carbon/icons-react";

export const Error: FunctionalComponent = ({ children }) => (
  <div class="flex items-center mt-2">
    <WarningAltFilled class="custom-icon-fill custom-icon-fill--alert mr-2" />
    {children}
  </div>
);
