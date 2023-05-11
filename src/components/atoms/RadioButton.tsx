import { FunctionComponent } from "preact";
import { useId } from "preact/hooks";
import { HTMLAttributes } from "react";

interface RadioButtonProps extends HTMLAttributes<HTMLButtonElement> {
  label: string;
  name: string;
}

export const RadioButton: FunctionComponent<RadioButtonProps> = ({
  label,
  id,
  name,
  ...rest
}) => {
  const _id = useId();
  const className = {
    base: `appearance-none w-4 h-4 mr-2.5 shrink-0 outline outline-1 outline-interactive-icon-01 rounded-full`,
    focus: `focus:ring-2 focus:ring-offset-1 focus:ring-focus`,
    checked: `before:checked:block before:hidden before:w-2 before:h-2 before:absolute before:bg-interactive-icon-01 before:rounded-full before:m-1`,
  };

  return (
    <label
      class={`flex flex-row items-center my-2 text-sm leading-tight text-text-01`}
      htmlFor={id ?? _id}
    >
      <input
        type="radio"
        class={`${className.base} ${className.focus} ${className.checked}`}
        id={id ?? _id}
        name={name}
        {...rest}
      />
      {label}
    </label>
  );
};
