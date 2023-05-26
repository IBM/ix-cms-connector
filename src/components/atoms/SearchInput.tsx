import { FunctionalComponent } from "preact";
import { Search, Close } from "@carbon/icons-react";
import { useState, useId } from "preact/hooks";
import { HTMLAttributes } from "react";
import { debounce } from "../../utils/funcs/debounce";

interface SearchInputProps extends HTMLAttributes<HTMLInputElement> {
  label: string;
  onSearchText: (term: string) => void;
}

export const SearchInput: FunctionalComponent<SearchInputProps> = ({
  label,
  onSearchText,
  ...input
}) => {
  const inputId = useId();

  const [searchTerm, setSearchTerm] = useState<string>("");

  const onChange = (event): void => {
    if (event.target) {
      const searchValue = event.target.value;

      setSearchTerm(searchValue);
      onSearchText(searchValue);
    }
  };

  const onClean = (): void => {
    setSearchTerm("");
    onSearchText("");
  };

  const debouncedChange = debounce(onChange, 300);

  return (
    <label htmlFor={inputId} class="flex flex-col">
      {!!label && (
        <span class="text-text-02 font-normal text-xs mb-2">{label}</span>
      )}
      <div class="flex relative items-center bg-ui-shell-white focus:outline-8 border-b border-ui-04">
        <Search class="absolute left-0 ml-3" />
        <input
          id={inputId}
          type="text"
          value={searchTerm}
          aria-label={label}
          onChange={debouncedChange}
          {...input}
          class="py-3.5 px-10 min-w-0 w-full text-sm text-text-01 placeholder-text-03 bg-ui-shell-white box-border focus:outline-focus"
        />
        {searchTerm && (
          <button
            alt="clear"
            onClick={onClean}
            class="bg-ui-shell-white absolute right-0 mr-3  focus:outline-focus"
          >
            <Close />
          </button>
        )}
      </div>
    </label>
  );
};
