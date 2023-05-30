import { FunctionalComponent } from "preact";
import { useState, useEffect, useRef } from "preact/hooks";
import { Copy, ChevronDown } from "@carbon/icons-react";

type CodeSnippetProps = {
  snippet: string;
  inline?: boolean;
};

export const CodeSnippet: FunctionalComponent<CodeSnippetProps> = ({
  snippet,
  inline,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasShowMore, setHasShowMore] = useState(true);
  const EXPAND_HEIGHT = 160;
  const overflowRef = useRef<HTMLDivElement>();

  useEffect(() => {
    setHasShowMore(overflowRef.current.scrollHeight >= EXPAND_HEIGHT);
  }, [snippet]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(snippet);
  };
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (inline) {
    return <code class="bg-field-01 text-xs px-2 rounded-sm">{snippet}</code>;
  }

  return (
    <div
      ref={overflowRef}
      class={`block min-w-[320px] bg-field-01 relative  after:absolute after:right-0 after:top-0 after:h-full after:bg-gradient-to-r after:from-transparent after:to-ui-01 after:w-6 ${
        isExpanded
          ? `min-h-max`
          : `max-h-40 before:absolute before:left-0 before:bottom-0 before:w-full before:h-6  before:bg-gradient-to-b before:from-transparent before:to-ui-01`
      }`}
    >
      <div
        class={`p-4 text-xs overflow-hidden focus:outline focus:outline-2 focus:outline-focus ${
          isExpanded ? `min-h-[5rem] h-auto` : `min-h-[5rem] max-h-40`
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
        <Copy class="w-4 h-4 fill-interactive-02" />
      </button>
      {hasShowMore && (
        <button
          class="flex items-center pr-2 pl-4 absolute bottom-0 right-0 z-20 text-sm leading-tight bg-ui-01 hover:bg-hover-ui active:bg-active-ui"
          onClick={toggleExpand}
        >
          {isExpanded ? "Show less" : "Show more"}
          <ChevronDown
            class={`w-4 h-4 fill-interactive-02 m-2 transition-transform delay-100 duration-300 origin-center ${
              isExpanded ? `rotate-180` : `rotate-0`
            }`}
          />
        </button>
      )}
    </div>
  );
};
