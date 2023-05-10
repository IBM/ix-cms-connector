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
  handleOptionSelect: () => void;
}

export const Checkbox: FunctionComponent<CheckboxProps> = ({
  id,
  label = "",
  handleOptionSelect,
  ...rest
}) => {
  const [selected, setSelected] = useState<boolean>(false);

  const handleOnClick = (event: Event) => {
    setSelected(!selected);
    console.log("event: ", event);
    handleOptionSelect();
  };

  return (
    <div class="flex flex-row items-center my-2 mr-3.5">
      <input
        type="checkbox"
        id={id}
        {...rest}
        class="appearance-none"
        onClick={(event) => handleOnClick(event)}
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
        <span class="ml-2">{label}</span>
      </label>
    </div>
  );
};
