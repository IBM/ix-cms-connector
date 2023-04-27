import { FunctionComponent } from "preact";
import { CodeSnippet } from "../molecule/CodeSnippet";
import { generateAdapterCode, type MappedProps } from "../../utils";
import { Documentation } from "react-docgen";

interface CodeGeneratorProps {
  componentDoc: Documentation;
  mappedProps: MappedProps;
}

export const CodeGenerator: FunctionComponent<CodeGeneratorProps> = ({
  componentDoc,
  mappedProps,
}) => {
  const code = generateAdapterCode(componentDoc, mappedProps, {
    indentNumberOfSpaces: 2,
  });

  return (
    <div>
      <h3 class="mb-4 font-semibold text-lg">Adapter Code</h3>
      <CodeSnippet snippet={code} />
    </div>
  );
};
