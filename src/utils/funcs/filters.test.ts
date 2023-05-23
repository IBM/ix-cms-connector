import { describe, it, expect } from "vitest";

import {
  type MappableProp,
  filterByPropName,
  filterByPropType,
  filterPropsList,
  getTypesFilterFromList,
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

describe("getTypesFilterFromList()", () => {
  it("should return all the types by which the user can filter a given props list without repetitions", () => {
    const result = getTypesFilterFromList(list);
    expect(result).toStrictEqual(["string", "number", "boolean"]);
  });
});

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
});

describe("filterPropsList", () => {
  it("should return a filtered array of MappableProp by the given search term and type", () => {
    const searchTerm = "count";
    const types = ["boolean"];

    const result = filterPropsList(searchTerm, types, list);

    expect(result).toStrictEqual([
      {
        isRequired: true,
        name: "showCounter",
        type: TSType.Boolean,
      },
    ]);
  });

  it("should return the initial list when the search term is empty and all the types present on the list are passed", () => {
    const searchTerm = "";
    const types = getTypesFilterFromList(list);

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

  it("should return 0 results if the types array is empty even though a search term is given", () => {
    const searchTerm = "label";
    const types = [];

    const result = filterPropsList(searchTerm, types, list);

    expect(result).toHaveLength(0);
  });
});
