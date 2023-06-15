/*
 * Copyright 2020- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
import { FunctionComponent } from "preact";
import { useEffect, useState } from "preact/hooks";
import { HTMLAttributes } from "react";
import {
  Checkbox as CheckboxIcon,
  CheckboxCheckedFilled,
  CheckboxIndeterminate,
} from "@carbon/icons-react";

interface CheckboxProps extends HTMLAttributes<HTMLButtonElement> {
  id: string;
  label: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  handleOptionSelect: (isSelected: boolean) => void;
}

export const Checkbox: FunctionComponent<CheckboxProps> = ({
  id,
  label,
  defaultChecked = false,
  disabled = false,
  handleOptionSelect,
  ...rest
}) => {
  const [checked, setChecked] = useState<boolean>(false);

  const onChangeHandler = () => {
    setChecked(!checked);
    handleOptionSelect(!checked);
  };

  const renderCheckboxIcon = () => {
    if (disabled) return <CheckboxIndeterminate size="20" />;
    if (checked) return <CheckboxCheckedFilled size="20" />;
    return <CheckboxIcon size="20" />;
  };

  useEffect(() => {
    setChecked(defaultChecked);
  }, [defaultChecked]);

  return (
    <div class="flex flex-row items-center">
      <input
        type="checkbox"
        id={id}
        aria-checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        {...rest}
        class={`appearance-none ${
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        onChange={onChangeHandler}
      />

      <label
        class={`flex items-center text-sm leading-tight ${
          disabled
            ? "text-disabled-03 cursor-not-allowed"
            : "text-text-01 cursor-pointer"
        }`}
        htmlFor={id}
      >
        {renderCheckboxIcon()}
        <span class="ml-2">{label}</span>
      </label>
    </div>
  );
};
