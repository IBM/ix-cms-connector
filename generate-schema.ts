import process from "process";
import jsonSchemaGenerator from "json-schema-generator";
import axios from "axios";

const testEndpoint = process.argv[2] || "https://dummyjson.com/products/1";

const getJson = async (endpoint) => {
  const res = await axios(endpoint);
  return await res.data;
};

export const getSchema = async (endpoint) => {
  const json = await getJson(endpoint);
  const schema = jsonSchemaGenerator(json);
  console.log("schema", schema);
};

getSchema(testEndpoint);
