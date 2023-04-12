import { FunctionComponent } from "preact";
import { useEffect, useState } from "preact/hooks";
import { parse, type Documentation } from "react-docgen";

interface ParserProps {
  file?: File;
}

// taken from the official repo, see https://github.com/reactjs/react-docgen/blob/main/packages/website/src/components/playground/Playground.tsx
const defaultParserPlugins = [
  "jsx",
  "asyncDoExpressions",
  "decimal",
  "decorators",
  "decoratorAutoAccessors",
  "destructuringPrivate",
  "doExpressions",
  "explicitResourceManagement",
  "exportDefaultFrom",
  "functionBind",
  "functionSent",
  "importAssertions",
  "importReflection",
  "moduleBlocks",
  "partialApplication",
  ["pipelineOperator", { proposal: "minimal" }],
  "recordAndTuple",
  "regexpUnicodeSets",
  "throwExpressions",
];

function getParserConfig(fileName: string) {
  const fileExt = fileName.split(".").pop().toLowerCase();

  return {
    babelOptions: {
      babelrc: false,
      babelrcRoots: false,
      configFile: false,
      filename: fileName,
      parserOpts: {
        plugins: [
          ...defaultParserPlugins,
          ["ts", "tsx"].includes(fileExt) ? "typescript" : "flow",
        ],
      },
    },
  };
}

const Parser: FunctionComponent<ParserProps> = ({ file }) => {
  const [doc, setDoc] = useState<Documentation[]>();
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
          const doc = parse(
            event.target.result as string,
            getParserConfig(file.name)
          );

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
      <h4 class="font-semibold">{file.name}</h4>

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
