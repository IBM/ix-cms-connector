import { FunctionalComponent } from "preact";
import { HTMLAttributes } from "react";

interface InputProps extends HTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: FunctionalComponent<InputProps> = ({ label, ...input }) => {
  return (
    <label class="flex flex-1 flex-col">
      {!!label && (
        <span class="text-text-02 font-normal text-xs mb-2">{label}</span>
      )}
      <input
        class="p-3.5 text-text-01 placeholder-text-03 text-sm bg-ui-shell-white border-solid border-b rounded-none border-ui-04 box-content focus:outline-focus focus:border-ui-shell-white"
        {...input}
      ></input>
    </label>
  );
};
