import { describe, it, expect, vi } from "vitest";

import jsonSchemaGenerator from "json-schema-generator";

import { getJson, getSchema } from "./generate-schema";

// Mocks a module (gets hoisted at the beginning of the file)
// It's functionality can be mocked under the folder "__mocks__"
// to make it available to all the tests globally
vi.mock("axios");
vi.mock("json-schema-generator");

// Will be reused in the tests (it can be set individually)
const testEndpoint = "https://dummyjson.com/products/1";

describe("getJson()", () => {
  it("should return any data available for the endpoint", async () => {
    const result = await getJson(testEndpoint);
    expect(result).toBeDefined();
  });
});

describe("getSchema()", () => {
  it("should execute the jsonSchemaGenerator method", async () => {
    await getSchema(testEndpoint);

    // Check that the mocked module was called
    expect(jsonSchemaGenerator).toBeCalled();
  });

  it("should return a promise that resolves to a defined value", () => {
    // resets the mocks, so we can use the real module
    vi.restoreAllMocks();

    // "return" and "resolve" is a way of handling a promise
    return expect(getSchema(testEndpoint)).resolves.toBeDefined();
  });
});
