import { FunctionComponent } from "preact";

export enum ButtonType {
  PRIMARY = "primary",
  SECONDARY = "secondary",
}

interface ButtonProps {
  onClick: () => void;
  text: string;
  type: ButtonType;
  disabled?: boolean;
}

export const Button: FunctionComponent<ButtonProps> = ({
  onClick,
  text,
  type,
  disabled
}) => {
  const colorsVariants = {
    primary: "bg-blue-primary hover:bg-blue-hover",
    secondary: "bg-gray-primary hover:bg-gray-hover",
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      class={`${colorsVariants[type]} py-3 pl-3.5 pr-16 text-white text-sm font-normal focus:outline-2 focus:outline-offset-2 focus:outline-blue-primary rounded-none disabled:bg-disabled-02 disabled:text-disabled-03`}
    >
      {text}
    </button>
  );
};
