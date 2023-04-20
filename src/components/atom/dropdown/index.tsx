import { FunctionComponent } from "preact";
import { HTMLAttributes } from "react";

export interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps extends HTMLAttributes<HTMLSelectElement> {
  ariaLabel?: string;
  label?: string;
  customOptions: DropdownOption[];
  handleOptionSelect: (option: DropdownOption) => void;
}

export const Dropdown: FunctionComponent<DropdownProps> = ({
  label,
  customOptions,
}) => {
  return (
    <label label={label}>
      {label}
      <select>
        {customOptions.map((_option: DropdownOption) => {
          return <option value={_option.value}>{_option.label}</option>;
        })}
      </select>
    </label>
  );
};
