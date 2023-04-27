import process from "process";
import { getJSONSchema } from "src/utils";

const testEndpoint = process.argv[2] || "https://dummyjson.com/products/1";

getJSONSchema(testEndpoint);
