import { FunctionComponent } from "preact";
import { useEffect, useState } from "preact/hooks";
import { parse, type Documentation } from "react-docgen";
import { getComponentParserConfig } from "../../utils";
import { FileSelect } from "../molecules/FileSelect";
import { Error } from "../atoms/Error";

interface ComponentParserFormProps {
  onParsed: (doc: Documentation) => void;
}

export const ComponentParserForm: FunctionComponent<
  ComponentParserFormProps
> = ({ onParsed }) => {
  const [file, setFile] = useState<File>();
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    try {
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

          setPending(false);

          onParsed(docs[0]);
        } catch (err) {
          setError(!!err);
          setPending(false);
        }
      };

      reader.readAsText(file);
    } catch (err) {
      setError(!!err);
      setPending(false);
    }
  }, [file]);

  return (
    <div>
      <FileSelect onSelect={setFile} onRemoveFile={() => setFile(null)} />

      {file && (
        <div class="mt-2">
          {pending && <span>Parsing...</span>}
          {error && (
            <Error>
              <p class="mb-0">
                No component found in
                <span class="text-text-01"> {file.name}</span>
              </p>
            </Error>
          )}
        </div>
      )}
    </div>
  );
};
