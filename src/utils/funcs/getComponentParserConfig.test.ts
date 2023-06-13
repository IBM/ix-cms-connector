/*
 * Copyright 2020- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
import { describe, it, expect } from "vitest";

import { getComponentParserConfig } from "./getComponentParserConfig";

describe("getComponentParserConfig()", () => {
  it("should return proper config for parsing Typescript components if the given filename is a .ts file", () => {
    const fileName = "file.ts";

    const result = getComponentParserConfig(fileName);

    expect(result).toEqual({
      babelOptions: expect.objectContaining({
        filename: fileName,
        parserOpts: expect.objectContaining({
          plugins: expect.arrayContaining(["typescript"]),
        }),
      }),
    });
  });

  it("should return proper config for parsing JS components if the given filename is a .js file", () => {
    const fileName = "file.js";

    const result = getComponentParserConfig(fileName);

    expect(result).toEqual({
      babelOptions: expect.objectContaining({
        filename: fileName,
        parserOpts: expect.objectContaining({
          plugins: expect.arrayContaining(["flow"]),
        }),
      }),
    });
  });
});
