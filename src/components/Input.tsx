export const Input = ({ label, ...input }) => {
    return (
        <label>
            {label}
            <input {...input}>
            </input>
        </label>
    )
};
