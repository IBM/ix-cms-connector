import { FunctionalComponent } from "preact";
import { useState } from "preact/hooks";
import copyIcon from "../../../icons/copy.svg";
import chevronDownIcon from "../../../icons/chevron--down.svg";

type CodeSnippetProps = {
  snippet: string;
};

export const CodeSnippet: FunctionalComponent<CodeSnippetProps> = ({
  snippet,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(snippet);
  };
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      class={`block bg-field-01 relative  after:absolute after:right-0 after:top-0 after:h-full after:bg-gradient-to-r after:from-transparent after:to-ui-01 after:w-6 ${
        isExpanded
          ? ` min-h-max`
          : `max-h-44 before:absolute before:left-0 before:bottom-0 before:w-full before:h-6  before:bg-gradient-to-b before:from-transparent before:to-ui-01`
      }`}
    >
      <div
        class={`p-4 text-xs overflow-hidden focus:outline focus:outline-2 focus:outline-focus ${
          isExpanded ? `h-auto` : `max-h-44`
        }`}
        role="textbox"
        aria-readonly={true}
        aria-multiline={true}
        aria-label="Copy to clipboard"
        tabIndex={0}
        onCopy={copyToClipboard}
      >
        <pre>
          <code class="text-xs">{snippet}</code>
        </pre>
      </div>
      <button
        onClick={copyToClipboard}
        class="p-2 m-2 absolute right-0 top-0 z-20 outline-focus bg-ui-01 hover:bg-hover-ui active:bg-active-ui"
      >
        <img src={copyIcon} alt="Copy to clipboard" class="w-4 h-4" />
      </button>
      <button
        class="flex items-center pr-2 pl-4 absolute bottom-0 right-0 z-20 text-sm leading-tight bg-ui-01 hover:bg-hover-ui"
        onClick={toggleExpand}
      >
        {isExpanded ? "Show less" : "Show more"}
        <img
          src={chevronDownIcon}
          class={`w-4 h-4 m-2 transition-transform delay-100 duration-300 origin-center ${
            isExpanded ? `rotate-180` : `rotate-0`
          }`}
          alt=""
          aria-hidden={true}
        />
      </button>
    </div>
  );
};
