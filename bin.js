#!/usr/bin/env node
const http = require('http');
const path = require('path');
const fs = require('fs');
const port = process.env.PORT || 8080;

const mimeTypes = {
  "html": "text/html",
  "js": "text/javascript",
  "css": "text/css",
  "json": "application/json"
};

http.createServer((req, res) => {
    const { method, url, headers } = req;
    const basePath = __dirname + '/build';

    if (url === '/') {
      fs.readFile(basePath + '/index.html', (err, contents) => {
        if(err) {
          console.dir(err)
        } else {
          res.end(contents)
        }
      })
    } else {
      console.log(basePath + url)
      fs.readFile(basePath + url, (err, contents) => {
        if(err) {
          console.dir(err)
        } else {
          console.log(url)

            const mimeType = mimeTypes[url?.split('.').pop()] ?? 'text/html';
          
            res.writeHead(200, {"Content-Type": mimeType});
          
            res.write(contents);
            res.end();
        }
      })
    }

  }).listen(port);
