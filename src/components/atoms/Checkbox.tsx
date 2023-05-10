import { FunctionComponent } from "preact";
import { useState } from "preact/hooks";
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
  label = "",
  ...rest
}) => {
  const [selected, setSelected] = useState<boolean>(false);

  return (
    <div class="flex flex-row items-center my-2">
      <input
        type="checkbox"
        id={id}
        {...rest}
        class="appearance-none"
        onClick={() => setSelected(!selected)}
      />

      <label
        class="flex items-center text-sm leading-tight text-text-01"
        htmlFor={id}
      >
        {selected ? (
          <CheckboxCheckedFilled size="20" />
        ) : (
          <CheckboxIcon size="20" />
        )}
        <span class="ml-2.5">{label}</span>
      </label>
    </div>
  );
};
