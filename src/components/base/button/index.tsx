import { FunctionComponent } from "preact";

export enum ButtonType {
    PRIMARY = 'primary',
    SECONDARY = 'secondary',
}

interface ButtonProps {
    onClick: () => void;
    text: string;
    type: ButtonType;
}

export const Button: FunctionComponent<ButtonProps> = ({ onClick, text, type }) => {
    const colorsVariants = {
        primary: 'bg-blue-primary hover:bg-blue-hover',
        secondary: 'bg-gray-primary hover:bg-gray-hover'
    }

    return <button onClick={onClick} class={`${colorsVariants[type]} py-3 pl-3.5 pr-16 text-white text-sm font-normal`}>{text}</button>
};

