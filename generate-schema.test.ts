import { vi } from "vitest";

import { getSchema } from "./generate-schema";
import jsonSchemaGenerator from "json-schema-generator";

// Mocks a module (gets hoisted at the beginning of the file)
vi.mock("json-schema-generator");

// Will be reused in the tests (it can be set individually)
const testEndpoint = "https://dummyjson.com/products/1";

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
