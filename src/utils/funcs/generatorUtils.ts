import type { Documentation } from "react-docgen";
import { TSType, PropSource } from "../const";
import type { MappableProp, MappedProps, TreeProp } from "../types";
import CodeBlockWriter from "code-block-writer";
import { getPropsConverter } from "./getPropsConverter";
import {
  ObjectSignatureType,
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

export function getPropsTree(
  propsTreeIndex: PropSource,
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

export function writeMappedPropsInterface(
  writer: CodeBlockWriter,
  propsTreeIndex: PropSource,
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
  propPath: string[],
  compMappedPropsTree: TreeProp[]
) {
  if ((typeDescr as ObjectSignatureType).type === "object") {
    const { properties } = (typeDescr as ObjectSignatureType).signature;
    const path = [...propPath, propName];

    const objMappedPropsTree = path.reduce((propsTree, pathSegment) => {
      const treePropMatched = propsTree.find((tp) => tp.name === pathSegment);

      if (treePropMatched) {
        return treePropMatched.props ?? [];
      }

      return [];
    }, compMappedPropsTree);

    // todo: need to improve, rn it will exclude a top level prop if a not mapped field somewhere in the nested object
    const areAllChildrenMapped = properties.every(
      (p) =>
        typeof p.key === "string" &&
        objMappedPropsTree.some((tp) => tp.name === p.key)
    );

    if (!areAllChildrenMapped) {
      writer
        .write(`${propName}${required ? "" : "?"}: `)
        .inlineBlock(() =>
          properties.forEach((p) => {
            // only standard prop names are supported atm for TS, eg:
            // { prop: number; } is supported
            // { [x: string]: number; } is not supported
            if (typeof p.key === "string") {
              writeRestPropType(
                writer,
                p.key,
                p.value,
                p.value.required,
                path,
                compMappedPropsTree
              );
            }
          })
        )
        .write(";")
        .newLine();
    }
  } else {
    const parentMappedPropsTree = propPath.length
      ? propPath.reduce((propsTree, pathSegment) => {
          const treePropMatched = propsTree.find(
            (tp) => tp.name === pathSegment
          );

          if (treePropMatched) {
            return treePropMatched.props ?? [];
          }

          return [];
        }, compMappedPropsTree)
      : compMappedPropsTree;

    const isMapped = parentMappedPropsTree.some((tp) => tp.name === propName);

    if (!isMapped) {
      const type = "raw" in typeDescr ? typeDescr.raw : typeDescr.name;

      writer.writeLine(`${propName}${required ? "" : "?"}: ${type};`);
    }
  }
}

export function writeRestPropsInterface(
  writer: CodeBlockWriter,
  componentDoc: Documentation,
  compMappedPropsTree: TreeProp[]
) {
  Object.entries(componentDoc.props ?? {}).forEach(([name, descr]) => {
    if (descr.tsType) {
      writeRestPropType(
        writer,
        name,
        descr.tsType,
        descr.required,
        [],
        compMappedPropsTree
      );
    }
  });
}

export function writeMappedPropsObjectBody(
  writer: CodeBlockWriter,
  propsTree: TreeProp[],
  path: string[]
) {
  writer.writeLine(
    `...restProps${`${path.length ? "." : ""}${path.join("?.")}`},`
  );

  propsTree.forEach((tp) => {
    if (tp.mappedPair) {
      writer.writeLine(
        `${tp.name}: ${getCMSFieldPath(tp.mappedPair[0], tp.mappedPair[1])},`
      );
    } else if (tp.props) {
      writer
        .write(`${tp.name}: `)
        .inlineBlock(() =>
          writeMappedPropsObjectBody(writer, tp.props, [...path, tp.name])
        )
        .write(",")
        .newLine();
    }
  });
}
