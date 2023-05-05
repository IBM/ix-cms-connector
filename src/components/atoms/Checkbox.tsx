import { FunctionComponent } from "preact";
import { HTMLAttributes } from "react";

interface CheckboxProps extends HTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export const Checkbox: FunctionComponent<CheckboxProps> = ({
  id,
  label,
  ...rest
}) => {
  return (
    <div>
      <input type="checkbox" id={id} {...rest} />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};
