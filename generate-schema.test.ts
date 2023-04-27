import { getSchema } from "./generate-schema";

describe("getSchema()", () => {
  it("should execute the jsonSchemaGenerator method", () => {
    const testEndpoint = "https://dummyjson.com/products/1";

    // "return" and "resolve" is a way of handling async code
    return expect(getSchema(testEndpoint)).resolves.toBeDefined();
  });
});
