import type { Documentation } from "react-docgen";
import type { CodeGeneratorOptions, MappedProps } from "../types";
import { PropSource } from "../const";
import CodeBlockWriter from "code-block-writer";
import {
  getPropsTree,
  writeMappedPropsInterface,
  writeMappedPropsObjectBody,
  writeRestPropsInterface,
} from "./generatorUtils";

export function generateAdapterCode(
  componentDoc: Documentation,
  mappedProps: MappedProps,
  options?: CodeGeneratorOptions & { usePreact?: boolean }
) {
  // if the component has a tsType field in any of the PropDescriptor, then it's Typescript
  const isTS = Object.entries(componentDoc.props ?? {}).some(
    ([, pd]) => pd.tsType
  );

  // helpers
  const componentName = componentDoc.displayName ?? "Component";
  const hofName = `connect${componentName}ToCMS`;
  const mappedCMSFieldsTypeName = `${componentName}MappedCMSFields`;
  const mappedPropsTypeName = `${componentName}MappedProps`;
  const restPropsTypeName = `${componentName}RestProps`;

  const cmsPropsTree = getPropsTree(PropSource.CMS, mappedProps);
  const compPropsTree = getPropsTree(PropSource.COMPONENT, mappedProps);

  const addTypeDef = (typeDefinition: string) => (isTS ? typeDefinition : "");

  // start writing

  const writer = new CodeBlockWriter({
    ...options,
  });

  // if it's TS, then we need to add some type imports and defenitions
  let requiredTypeDefs: CodeBlockWriter;

  if (isTS) {
    requiredTypeDefs = writer
      .write("import { ComponentType } from ")
      .quote(`${options?.usePreact ? "p" : ""}react`)
      .write(";")

      .blankLine()

      // an interface for the mapped CMS fields
      .write(`interface ${mappedCMSFieldsTypeName}`)
      .block(() =>
        writeMappedPropsInterface(writer, PropSource.CMS, cmsPropsTree)
      )

      .blankLine()

      // an interface for the mapped component props
      .write(`interface ${mappedPropsTypeName}`)
      .block(() =>
        writeMappedPropsInterface(writer, PropSource.COMPONENT, compPropsTree)
      )

      .blankLine()

      // an interface for the rest component props
      .write(`interface ${restPropsTypeName}`)
      .block(() => writeRestPropsInterface(writer, componentDoc, compPropsTree))

      .blankLine();
  } else {
    requiredTypeDefs = writer;
  }

  // then we are creating our function (see samples/adaptor/connect.tsx as an example of the ready function)
  // we use addTypeDef() function to conditionaly (if it's a TS component) add type definitions
  const snippetCode = requiredTypeDefs
    .write(
      `export function ${hofName}(cmsData${addTypeDef(
        `: ${mappedCMSFieldsTypeName}`
      )})`
    )
    .block(() => {
      writer
        .writeLine(
          `return function enhance${addTypeDef(
            `<P extends ${mappedPropsTypeName}>`
          )}(`
        )

        .indent()
        .write(`Component${addTypeDef(": ComponentType<P>")}`)
        .newLine()

        .write(") ")
        .inlineBlock(() => {
          writer
            .writeLine(`return function ConnectedComponent(`)

            .indent()
            .write(`restProps${addTypeDef(`: ${restPropsTypeName}`)}`)
            .newLine()

            .write(") ")
            .inlineBlock(() => {
              writer
                .write(
                  `const mappedProps${addTypeDef(
                    `: ${mappedPropsTypeName}`
                  )} = `
                )
                .inlineBlock(() => {
                  writeMappedPropsObjectBody(writer, compPropsTree);
                })
                .write(";")

                .blankLine()

                .write(`const allProps = `)
                .inlineBlock(() => {
                  writer
                    .writeLine("...mappedProps,")
                    .writeLine("...restProps,");
                })
                .write(`${addTypeDef(" as P")};`)

                .blankLine()

                .write(`return <Component {...allProps} />;`);
            })
            .write(";");
        })
        .write(";");
    });

  return snippetCode.toString();
}
