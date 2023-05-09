import { FunctionComponent } from "preact";
import { HTMLAttributes } from "react";
import {
  Checkbox as CheckboxIcon,
  CheckboxCheckedFilled,
} from "@carbon/icons-react";

interface CheckboxProps extends HTMLAttributes<HTMLButtonElement> {
  id: string;
  label?: string;
}

export const Checkbox: FunctionComponent<CheckboxProps> = ({
  id,
  label,
  ...rest
}) => {
  const className = {
    base: "w-4 h-4 shrink-0 border-ui-05 rounded-sm",
    focus: "",
    checked: "",
  };

  return (
    <div class="flex flex-row items-center my-2">
      <CheckboxIcon class="fill-interactive-icon-01" size="15" />
      <input
        type="checkbox"
        id={id}
        {...rest}
        class={`${className.base} ${className.focus} ${className.checked}`}
      />
      {label && (
        <label class="text-sm leading-tight ml-2.5 text-text-01" htmlFor={id}>
          {label}
        </label>
      )}
    </div>
  );
};
