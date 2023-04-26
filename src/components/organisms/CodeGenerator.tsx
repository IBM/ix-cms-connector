import { FunctionComponent } from "preact";
import { CodeSnippet } from "../molecule/CodeSnippet";
import { generateAdapterCode, type MappedFields } from "../../utils";
import { Documentation } from "react-docgen";

interface CodeGeneratorProps {
  componentDoc: Documentation;
  mappedFields: MappedFields;
}

export const CodeGenerator: FunctionComponent<CodeGeneratorProps> = ({
  componentDoc,
  mappedFields,
}) => {
  const code = generateAdapterCode(componentDoc, mappedFields, {
    indentNumberOfSpaces: 2,
  });

  return (
    <div>
      <h3 class="mb-4 font-semibold text-lg">Adapter Code</h3>
      <CodeSnippet snippet={code} />
    </div>
  );
};
