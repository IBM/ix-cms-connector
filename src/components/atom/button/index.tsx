import { FunctionComponent } from "preact";
import { HTMLAttributes } from "react";

export enum ButtonType {
  PRIMARY = "primary",
  SECONDARY = "secondary",
}

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  text: string;
  style: ButtonType;
}

export const Button: FunctionComponent<ButtonProps> = ({
  text,
  style,
  ...rest
}) => {
  const colorsVariants = {
    primary: "bg-interactive-01 hover:bg-hover-primary",
    secondary: "bg-interactive-02 hover:bg-hover-secondary",
  };

  return (
    <button
      class={`${colorsVariants[style]} py-3 pl-3.5 pr-16 text-text-04 text-sm font-normal focus:outline-2 focus:outline-offset-2 focus:outline-interactive-01 rounded-none disabled:bg-disabled-02 disabled:text-disabled-03`}
      {...rest}
    >
      {text}
    </button>
  );
};
