import { FunctionComponent } from "preact";
import { CodeSnippet } from "../molecules/CodeSnippet";
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
    <>
      <h3 class="mb-4">Connect function</h3>
      <CodeSnippet snippet={code} />
      <h3 class="mb-4 mt-16">How to use</h3>
      <p>
        To map the CMS data with the properties of your component, call the
        higher order component like so, passing it the data and invoke the
        returned function with the component you want to adapt as an argument.
      </p>
      <div class="my-4">
        <CodeSnippet
          snippet="const ConnectedComponent = connectSampleComponentToCMS(cmsData)(SampleComponent);"
          inline
        />
      </div>
      <p>
        The return value is the component with the CMS data already applied. The
        component can then be used as usual and you can pass the rest props if
        necessary. It is also possible to overwrite already applied props.
      </p>
      <div class="my-4">
        <CodeSnippet
          snippet={`<ConnectedComponent notMappedProp={new Date()} mappedProp="new value" />`}
          inline
        />
      </div>
    </>
  );
};
