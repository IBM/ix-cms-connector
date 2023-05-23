import { describe, it, expect } from "vitest";

import {
  type MappableProp,
  filterByPropName,
  filterByPropType,
  filterPropsList,
} from "../../utils";

import { TSType } from "../const";

const list: MappableProp[] = [
  {
    isRequired: true,
    name: "label",
    type: TSType.String,
  },
  {
    isRequired: true,
    name: "count",
    type: TSType.Number,
  },
  {
    isRequired: true,
    name: "isActive",
    type: TSType.Boolean,
  },
  {
    isRequired: true,
    name: "buttonLabel",
    type: TSType.String,
  },
];

describe("filterByPropName()", () => {
  it("should return a filtered array of MappableProp by the given search term", () => {
    const searchTerm = "label";

    const result = filterByPropName(searchTerm, list);

    expect(result).toStrictEqual([
      {
        isRequired: true,
        name: "label",
        type: TSType.String,
      },
      {
        isRequired: true,
        name: "buttonLabel",
        type: TSType.String,
      },
    ]);
  });
});

describe("filterByPropType()", () => {
  it("should return a filtered array of MappableProp by the given type", () => {
    const types = ["number", "boolean"];

    const result = filterByPropType(types, list);

    expect(result).toStrictEqual([
      {
        isRequired: true,
        name: "label",
        type: TSType.String,
      },
      {
        isRequired: true,
        name: "buttonLabel",
        type: TSType.String,
      },
    ]);
  });
});

describe("filterPropsList", () => {
  it("should return a filtered array of MappableProp by the given search team and type", () => {
    // TODO:
  });

  it("should return initial list when when the search term and types are empty", () => {
    // TODO:
  });
});
