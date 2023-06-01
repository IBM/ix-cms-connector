import { FunctionComponent } from "preact";
import { useEffect, useState } from "preact/hooks";
import { HTMLAttributes } from "react";
import {
  Checkbox as CheckboxIcon,
  CheckboxCheckedFilled,
} from "@carbon/icons-react";

interface CheckboxProps extends HTMLAttributes<HTMLButtonElement> {
  id: string;
  label: string;
  checked?: boolean;
  handleOptionSelect: (isSelected: boolean) => void;
}

export const Checkbox: FunctionComponent<CheckboxProps> = ({
  id,
  label,
  checked = false,
  handleOptionSelect,
  ...rest
}) => {
  const [selected, setSelected] = useState<boolean>(false);

  const handleOnClick = () => {
    handleOptionSelect(!selected);
    setSelected(!selected);
  };

  useEffect(() => {
    setSelected(checked);
  }, [checked]);

  return (
    <div class="flex flex-row items-center">
      <input
        type="checkbox"
        id={id}
        aria-checked={selected}
        checked={selected}
        {...rest}
        class="appearance-none cursor-pointer"
        onClick={handleOnClick}
      />

      <label
        class="flex items-center text-sm leading-tight text-text-01 cursor-pointer"
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
