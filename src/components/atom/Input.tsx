import { FunctionalComponent } from "preact";
import { HTMLAttributes } from "react";

interface InputProps extends HTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: FunctionalComponent<InputProps> = ({ label, ...input }) => {
  return (
    <label class="text-text-02 font-normal text-xs flex flex-1 flex-col">
      {label}
      <input
        class="p-3.5 text-text-01 placeholder-text-03 bg-ui-shell-white border-solid border-b rounded-none border-ui-04 my-2 box-content focus:outline-focus focus:border-ui-shell-white"
        {...input}
      ></input>
    </label>
  );
};
