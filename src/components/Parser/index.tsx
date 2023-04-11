import { FunctionComponent } from "preact";
import { useEffect, useState } from "preact/hooks";
import { parse } from "react-docgen";

interface ParserProps {
  file?: File;
}

const Parser: FunctionComponent<ParserProps> = ({ file }) => {
  const [doc, setDoc] = useState<any>();
  const [docString, setDocString] = useState<string>();
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  useEffect(() => {
    try {
      setDoc(undefined);
      setDocString(undefined);
      setError(undefined);

      if (!file) {
        return;
      }

      setPending(true);

      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const doc = parse(event.target.result as string);

          setDoc(doc);

          const docString = JSON.stringify(doc, undefined, 2);

          setDocString(docString);

          setPending(false);
        } catch (err) {
          setError(JSON.stringify(err, undefined, 2));
          setPending(false);
        }
      };

      reader.readAsText(file);
    } catch (err) {
      setError(JSON.stringify(err, undefined, 2));
      setPending(false);
    }
  }, [file]);

  if (!file) {
    return null;
  }

  return (
    <div class="mt-4">
      <h2 class="text-lg font-semibold">{file.name}</h2>

      <div class="mt-2">
        {pending && <span>Parsing...</span>}
        {error && (
          <div class="text-red-600 font-mono whitespace-pre p-4 rounded border-2 border-red-200 bg-red-50 max-h-96 text-sm overflow-scroll">
            {error}
          </div>
        )}
        {!error && !!docString && (
          <div class="font-mono whitespace-pre p-4 rounded border-2 border-emerald-200 bg-emerald-50 max-h-96 text-sm overflow-scroll text-emerald-600">
            {docString}
          </div>
        )}
      </div>
    </div>
  );
};

export default Parser;
