import { FunctionComponent } from "preact";
import { useEffect, useState } from "preact/hooks";
import { parse, type Documentation } from "react-docgen";
import { getComponentParserConfig } from "../utils";
import { FileSelect } from "./FileSelect";

interface ComponentParserFormProps {
  onParsed?: (doc?: Documentation, error?: unknown) => void;
}

export const ComponentParserForm: FunctionComponent<
  ComponentParserFormProps
> = ({ onParsed }) => {
  const [file, setFile] = useState<File>();
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
            onParsed(docs[0]);
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

  return (
    <div>
      <FileSelect onSelect={setFile} />

      {file && (
        <div class="mt-4">
          <h4 class="font-semibold">{file.name}</h4>

          <div class="mt-2">
            {pending && <span>Parsing...</span>}
            {error && (
              <div class="text-red-600 font-mono whitespace-pre p-4 rounded border-2 border-red-200 bg-red-50 max-h-96 text-sm overflow-scroll">
                {error}
              </div>
            )}
            {!error && !!docsString && (
              <div class="font-mono whitespace-pre p-4 rounded border-2 border-emerald-200 bg-emerald-50 max-h-96 text-sm overflow-scroll text-emerald-600">
                {docsString}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
