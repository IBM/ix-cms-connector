/*
 * Copyright 2020- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
import toJsonSchema from "to-json-schema";
import type { Options as CodeBlockWriterOptions } from "code-block-writer";
import { TSType } from "./const";

export type JSONSchema = toJsonSchema.JSONSchema3or4;

export interface MappableProp {
  name: string;
  type: TSType;
  subTypes?: TSType[]; // only for arrays and unions
  isRequired: boolean;
}

export type MappedProps = [MappableProp, MappableProp][];

export type ConverterFunc = (fieldPath: string) => string;

export interface TreeProp {
  name: string;
  props?: TreeProp[];
  mappedPair?: [MappableProp, MappableProp];
}

export type CodeGeneratorOptions = Partial<CodeBlockWriterOptions>;

export type TimeoutHandle = ReturnType<typeof setTimeout>;
