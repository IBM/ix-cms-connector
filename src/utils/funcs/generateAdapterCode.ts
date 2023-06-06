import type { Documentation } from "react-docgen";
import { TSType } from "../const";
import type { CodeGeneratorOptions, MappableProp, MappedProps } from "../types";
import CodeBlockWriter from "code-block-writer";
import { getPropsConverter } from "./getPropsConverter";
import {
  ObjectSignatureType,
  SimpleType,
  TSFunctionSignatureType,
  TypeDescriptor,
} from "react-docgen/dist/Documentation";

export function getCMSFieldPath(
  cmsField: MappableProp,
  compProp: MappableProp
) {
  const cmsFieldPath = `cmsData.${cmsField.name}`;
  const convert = getPropsConverter(cmsField, compProp);

  return convert ? convert(cmsFieldPath) : cmsFieldPath;
}

export function getMappablePropTypeSignature(mappableProp: MappableProp) {
  if (mappableProp.type === TSType.Array && mappableProp.subTypes) {
    return `${mappableProp.subTypes[0]}[]`;
  }

  if (mappableProp.type === TSType.Union && mappableProp.subTypes) {
    return mappableProp.subTypes.join(" | ");
  }

  return mappableProp.type;
}

interface TreeProp {
  name: string;
  props?: TreeProp[];
  mappedPair?: [MappableProp, MappableProp];
}

enum PropsTreeTarget {
  CMS = 0,
  Component = 1,
}

function getPropsTree(
  propsTreeIndex: PropsTreeTarget,
  mappedProps: MappedProps,
  path?: string
) {
  const pathPrefix = path ? `${path}.` : "";

  return mappedProps.reduce<TreeProp[]>((tree, mappedPair) => {
    const fullName = mappedPair[propsTreeIndex].name;
    const nameSegments = fullName.replace(pathPrefix, "").split(".");

    if (nameSegments.length === 1) {
      // a simple property

      tree.push({
        name: nameSegments[0],
        mappedPair,
      });
    } else {
      // an object property

      const objectPropName = nameSegments[0];

      if (tree.every((t) => t.name !== objectPropName)) {
        const fullPath = pathPrefix + objectPropName;

        tree.push({
          name: objectPropName,
          props: getPropsTree(
            propsTreeIndex,
            mappedProps.filter((mp) =>
              mp[propsTreeIndex].name.startsWith(fullPath)
            ),
            fullPath
          ),
        });
      }
    }

    return tree;
  }, []);
}

function writeMappedPropsInterface(
  writer: CodeBlockWriter,
  propsTreeIndex: PropsTreeTarget,
  propsTree: TreeProp[]
) {
  propsTree.forEach((tp) => {
    if (tp.mappedPair) {
      const mappedProp = tp.mappedPair[propsTreeIndex];

      writer.writeLine(
        `${tp.name}${
          mappedProp.isRequired ? "" : "?"
        }: ${getMappablePropTypeSignature(mappedProp)};`
      );
    } else if (tp.props) {
      writer
        .write(`${tp.name}: `)
        .inlineBlock(() =>
          writeMappedPropsInterface(writer, propsTreeIndex, tp.props)
        )
        .write(";")
        .newLine();
    }
  });
}

function writeRestPropType(
  writer: CodeBlockWriter,
  propName: string,
  typeDescr: TypeDescriptor<TSFunctionSignatureType>,
  required: boolean,
  compPropsTree: TreeProp[],
  path: string[]
) {
  if ((typeDescr as ObjectSignatureType).type === "object") {
    writer
      .write(`${propName}${required ? "" : "?"}: `)
      .inlineBlock(() =>
        (typeDescr as ObjectSignatureType).signature.properties.forEach((p) => {
          if (typeof p.key === "string") {
            writeRestPropType(
              writer,
              p.key,
              p.value,
              p.value.required,
              compPropsTree,
              [...path, propName]
            );
          }
        })
      )
      .write(";")
      .newLine();
  } else {
    const type = "raw" in typeDescr ? typeDescr.raw : typeDescr.name;

    writer.writeLine(`${propName}${required ? "" : "?"}: ${type};`);
  }
}

function writeRestPropsInterface(
  writer: CodeBlockWriter,
  componentDoc: Documentation,
  compPropsTree: TreeProp[]
) {
  Object.entries(componentDoc.props ?? {}).forEach(([name, descr]) => {
    if (descr.tsType) {
      writeRestPropType(
        writer,
        name,
        descr.tsType,
        descr.required,
        compPropsTree,
        []
      );
    }
  });
}

function writeMappedPropsObjectBody(
  writer: CodeBlockWriter,
  propsTree: TreeProp[]
) {
  propsTree.forEach((tp) => {
    if (tp.mappedPair) {
      writer.writeLine(
        `${tp.name}: ${getCMSFieldPath(tp.mappedPair[0], tp.mappedPair[1])},`
      );
    } else if (tp.props) {
      writer
        .write(`${tp.name}: `)
        .inlineBlock(() => writeMappedPropsObjectBody(writer, tp.props))
        .write(",")
        .newLine();
    }
  });
}

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

  const cmsPropsTree = getPropsTree(PropsTreeTarget.CMS, mappedProps);
  const compPropsTree = getPropsTree(PropsTreeTarget.Component, mappedProps);

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
        writeMappedPropsInterface(writer, PropsTreeTarget.CMS, cmsPropsTree)
      )

      .blankLine()

      // an interface for the mapped component props
      .write(`interface ${mappedPropsTypeName}`)
      .block(() =>
        writeMappedPropsInterface(
          writer,
          PropsTreeTarget.Component,
          compPropsTree
        )
      )

      .blankLine()

      // an interface for the rest component props
      .write(`interface ${restPropsTypeName}`)
      .block(() => writeRestPropsInterface(writer, componentDoc))

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
