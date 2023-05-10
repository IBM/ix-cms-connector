import { FunctionComponent, JSX } from "preact";

export enum ButtonType {
  PRIMARY = "primary",
  SECONDARY = "secondary",
}

interface ButtonProps extends JSX.HTMLAttributes {
  text: string;
  style: ButtonType;
  testId?: string;
}

export const Button: FunctionComponent<ButtonProps> = ({
  text,
  style,
  testId,
  ...rest
}) => {
  const colorsVariants = {
    primary: "bg-interactive-01 hover:bg-hover-primary",
    secondary: "bg-interactive-02 hover:bg-hover-secondary",
  };

  return (
    <button
      data-testid={testId}
      class={`${colorsVariants[style]} max-h-12 py-3 whitespace-nowrap pl-3.5 pr-16 text-text-04 text-sm font-normal focus:outline-2 focus:outline-offset-2 focus:outline-interactive-01 rounded-none disabled:bg-disabled-02 disabled:text-disabled-03`}
      {...rest}
    >
      {text}
    </button>
  );
};
