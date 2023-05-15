#!/usr/bin/env node
const http = require('http');
const path = require('path');
const fs = require('fs');
const childProcess = require("child_process");
const port = process.env.PORT || 8080;
const url = `http://localhost:${port}`;

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

const startCmd = process.platform == "darwin" ? "open"
  : process.platform == "win32" ? "start"
  : "xdg-open";
        
childProcess.exec(startCmd + " " + url);

console.log("CMS adaptor generator now running on port", port);