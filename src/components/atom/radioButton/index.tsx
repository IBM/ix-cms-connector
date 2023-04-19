import { FunctionComponent } from "preact";
import { HTMLAttributes } from "react";

interface RadioButtonProps extends HTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export const RadioButton: FunctionComponent<RadioButtonProps> = ({
  id,
  label,
  ...rest
}) => {
  const className = {
    base: `appearance-none w-4 h-4 shrink-0 outline outline-1 outline-interactive-icon-01 rounded-full`,
    focus: `focus:ring-2 focus:ring-offset-1 focus:ring-focus`,
    checked: `before:checked:block before:hidden before:w-2 before:h-2 before:bg-interactive-icon-01 before:rounded-full before:m-1`,
  };

  return (
    <div class={`flex flex-row items-center my-2`}>
      <input
        type="radio"
        class={`${className.base} ${className.focus} ${className.checked}`}
        id={id}
        {...rest}
      />
      {label && (
        <label class={`text-sm ml-2.5 text-text-01`} htmlFor={id}>
          {label}
        </label>
      )}
    </div>
  );
};
