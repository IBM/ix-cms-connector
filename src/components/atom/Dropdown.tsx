import { FunctionComponent, JSX } from "preact";
import { useRef, useState } from "preact/hooks";
import { ChevronDown } from "@carbon/icons-react";
import { useKeypress } from "../../hooks/useKeyPress";

export interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  label: string;
  description?: string;
  options: DropdownOption[];
  handleOptionSelect: (option: DropdownOption) => void;
  selected?: DropdownOption;
  placeholder?: string;
}

export const Dropdown: FunctionComponent<DropdownProps> = ({
  label,
  options,
  description,
  handleOptionSelect,
  selected,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useKeypress("Escape", () => {
    setIsOpen(false);
  });

  const handleDropdownClick = (event: JSX.TargetedMouseEvent<HTMLElement>) => {
    setIsOpen(!isOpen);
    event.stopPropagation();
  };

  const handleOptionClick = (
    event: JSX.TargetedMouseEvent<HTMLElement>,
    option: DropdownOption
  ) => {
    setIsOpen(false);
    handleOptionSelect(option);
    event.stopPropagation();
  };

  const handleKeyDown = (event: JSX.TargetedKeyboardEvent<HTMLElement>) => {
    switch (event.key) {
      case "Enter":
      case " ":
        setIsOpen(!isOpen);
        break;
      case "ArrowUp":
        if (isOpen && dropdownRef.current) {
          const options =
            dropdownRef.current.querySelectorAll('[role="option"]');
          const index = Array.from(options).indexOf(event.target);
          if (index > 0) {
            options[index - 1].focus();
          }
        }
        break;
      case "ArrowDown":
        if (isOpen && dropdownRef.current) {
          const options =
            dropdownRef.current.querySelectorAll('[role="option"]');
          const index = Array.from(options).indexOf(event.target);
          if (index < options.length - 1) {
            options[index + 1].focus();
          }
        }
        break;
    }
  };

  const handleKeyDownOnItem = (
    event: JSX.TargetedKeyboardEvent<HTMLElement>,
    option: DropdownOption
  ) => {
    switch (event.key) {
      case "Enter":
      case " ":
        handleOptionSelect(option);
        setIsOpen(!isOpen);
        event.stopPropagation();
        break;
    }
  };

  return (
    <div class="flex flex-col">
      <label class="text-xs text-text-02 font-normal mb-2">{label}</label>
      <div
        class={`${
          isOpen ? " drop-shadow" : ""
        } bg-ui-shell-white border-b border-ui-04 box-content`}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={label}
        onClick={handleDropdownClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        ref={dropdownRef}
      >
        <div class="py-3.5 px-4 flex justify-between">
          <div class="text-text-01 text-sm">
            {selected ? selected.label : placeholder}
          </div>
          <ChevronDown class={`${isOpen ? "rotate-180" : "rotate-0"}`} />
        </div>
        {isOpen && (
          <ul
            class="bg-ui-shell-white z-50 absolute top-full w-full border-t max-h-56 border-ui-03 overflow-auto divide-slate-200"
            role="listbox"
          >
            {options.map((option) => (
              <li
                class="px-4 [&:last-of-type>*]:border-none relative z-20"
                key={option.value}
                role="option"
                aria-selected={option.value === selected?.value}
                onClick={(event) => handleOptionClick(event, option)}
                onKeyDown={(event) => {
                  handleKeyDownOnItem(event, option);
                }}
                tabIndex={0}
              >
                <div class="text-text-02 text-sm w-full py-3.5 border-b border-ui-03">
                  {option.label}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <span class="text-xs text-text-02 font-normal mt-2">{description}</span>
    </div>
  );
};
