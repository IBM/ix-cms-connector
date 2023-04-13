import { FC, HTMLAttributes } from "preact/compat";

interface InputProps extends HTMLAttributes<HTMLInputElement> {
    label: string;
}

export const Input: FC<InputProps> = ({ label, ...input }) => {
    return (
        <label class="block text-gray-700 text-sm font-bold mb-2">
            {label}
            <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" {...input}>
            </input>
        </label>
    )
};
