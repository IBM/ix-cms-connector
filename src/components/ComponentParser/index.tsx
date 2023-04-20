import { FunctionComponent } from "preact";
import { useEffect, useState } from "preact/hooks";
import { parse, type Documentation } from "react-docgen";
import { getComponentParserConfig } from "../../utils";
import { CodeSnippet } from "../molecule/codeSnippet";

interface ComponentParserProps {
  file?: File;
  onParsed?: (docs?: Documentation[], error?: unknown) => void;
}

export const ComponentParser: FunctionComponent<ComponentParserProps> = ({
  file,
  onParsed,
}) => {
  const [docsString, setDocsString] = useState<string>(); // todo: remove later, we don't need to show parsed docs
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  useEffect(() => {
    try {
      setDocsString(undefined);
      setError(undefined);

      if (!file) {
        return;
      }

      setPending(true);

      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const docs = parse(
            event.target.result as string,
            getComponentParserConfig(file.name)
          );

          const docString = JSON.stringify(docs, undefined, 2);

          setDocsString(docString);
          setPending(false);

          if (onParsed) {
            onParsed(docs);
          }
        } catch (err) {
          setError(JSON.stringify(err, undefined, 2));
          setPending(false);

          if (onParsed) {
            onParsed(undefined, err);
          }
        }
      };

      reader.readAsText(file);
    } catch (err) {
      setError(JSON.stringify(err, undefined, 2));
      setPending(false);

      if (onParsed) {
        onParsed(undefined, err);
      }
    }
  }, [file]);

  if (!file) {
    return null;
  }

  return (
    <div class="mt-4">
      <h4 class="font-semibold">{file.name}</h4>

      <div class="mt-2">
        {pending && <span>Parsing...</span>}
        {error && (
          <div class="text-red-600 font-mono whitespace-pre p-4 rounded border-2 border-red-200 bg-red-50 max-h-96 text-sm overflow-scroll">
            {error}
          </div>
        )}
        {!error && !!docsString && <CodeSnippet snippet={docsString} />}
      </div>
    </div>
  );
};
