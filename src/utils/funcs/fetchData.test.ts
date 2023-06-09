/*
 * Copyright 2020- IBM Inc. All rights reserved
 * SPDX-License-Identifier: Apache2.0
 */
import { describe, it, expect, vi } from "vitest";

import { fetchData } from "./fetchData";

// Mocks a module (gets hoisted at the beginning of the file)
// It's functionality can be mocked under the folder "__mocks__"
// to make it available to all the tests globally
vi.mock("axios");

// Will be reused in the tests (it can be set individually)
const testEndpoint = "https://dummyjson.com/products/1";

describe("fetchData()", () => {
  it("should return any data available for the endpoint", async () => {
    await expect(fetchData(testEndpoint)).resolves.toBeDefined();
  });
});
