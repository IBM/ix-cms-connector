import process from "process";
import jsonSchemaGenerator from "json-schema-generator";
import axios from "axios";

const testEndpoint = process.argv[2] || "https://dummyjson.com/products/1";

const getJson = async () => {
  const res = await axios(testEndpoint);
  return await res.data;
};

const getSchema = async () => {
  const json = await getJson();
  const schema = jsonSchemaGenerator(json);
  console.log("schema", schema);
};

getSchema();
