import { HTMLAttributes } from "preact/compat";

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  text: string;
}

export const Button: FC<ButtonProps> = ({text, ...rest}) => {
  return <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" {...rest}>{text}</button>;
};