const process = require( 'process' );

var jsonSchemaGenerator = require('json-schema-generator'),
    obj = { some: { object: true } },
    schemaObj;


var testEndpoint = process.argv[2] || 'https://dummyjson.com/products/1';

var getJson = async() => {
    var res = await fetch(testEndpoint);
    return await res.json();
}

var getSchema = async() => {
    var json = await getJson();
    var schema = jsonSchemaGenerator(json);
    console.log('schema', schema)
}

getSchema();

