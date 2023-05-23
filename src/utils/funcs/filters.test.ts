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
  {
    isRequired: true,
    name: "showCounter",
    type: TSType.Boolean,
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
  it("should return a filtered array of MappableProp by the given search term and type", () => {
    const searchTerm = "count";
    const types = ["boolean"]; // boolean is unselected

    // TODO: invert logic for types to make it easier to understand

    const result = filterPropsList(searchTerm, types, list);

    expect(result).toStrictEqual([
      {
        isRequired: true,
        name: "count",
        type: TSType.Number,
      },
    ]);
  });

  it("should return initial list when when the search term and types are empty", () => {
    const searchTerm = "";
    const types = [];

    const result = filterPropsList(searchTerm, types, list);
    expect(result).toStrictEqual(list);
  });

  it("should only filter the list by the given type if the search term is empty", () => {
    const searchTerm = "";
    const types = ["string"];

    const result = filterPropsList(searchTerm, types, list);

    expect(result).toStrictEqual([
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
        name: "showCounter",
        type: TSType.Boolean,
      },
    ]);
  });

  it("should only filter the list by the given search term if the search term if the types array is empty", () => {
    const searchTerm = "label";
    const types = [];

    const result = filterPropsList(searchTerm, types, list);

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
