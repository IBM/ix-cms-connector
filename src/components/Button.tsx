import { FunctionalComponent } from "preact";
import { HTMLAttributes } from "react";

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  text: string;
}

export const Button: FunctionalComponent<ButtonProps> = ({ text, ...rest }) => {
  return (
    <button
      class="bg-interactive-03 text-text-04 font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
      {...rest}
    >
      {text}
    </button>
  );
};
