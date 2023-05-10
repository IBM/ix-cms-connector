import { FunctionalComponent } from "preact";
import { WarningAltFilled } from "@carbon/icons-react";

interface ErrorProps {
  error: string;
}

export const Error: FunctionalComponent<ErrorProps> = ({ error }) => (
  // <div class="text-red-600 font-mono whitespace-pre p-4 rounded border-2 border-red-200 bg-red-50 max-h-96 text-sm overflow-scroll">
  //   {error}
  // </div>
  <div>
    <WarningAltFilled class="fill-interactive-05" />
    <p>{error}</p>
  </div>
);
