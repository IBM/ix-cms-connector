#!/usr/bin/env node
const http = require('http');
const path = require('path');
const fs = require('fs');
const childProcess = require("child_process");
const port = process.env.PORT || 8080;

const mimeTypes = {
  // only includes required mime types for this app
  "html": "text/html",
  "js": "text/javascript",
  "css": "text/css",
  "json": "application/json"
};

// static server
http.createServer((req, res) => {
    const { url, headers } = req;
    // serve from build directory
    const basePath = __dirname + '/build';
    let file = basePath + url;

    if (url === '/') {
      file += 'index.html';
    }

    fs.readFile(file, (err, contents) => {
      if(err) {
        console.dir(err)
      } else {
        const mimeType = mimeTypes[file?.split('.').pop()] ?? 'text/plain';
        
        res.writeHead(200, {"Content-Type": mimeType});
        res.write(contents);
        res.end();
      }
    })
  }).listen(port);

const startCmd = process.platform == "darwin" ? "open"
  : process.platform == "win32" ? "start"
  : "xdg-open";
        
childProcess.exec(`${startCmd} http://localhost:${port}`);

console.log("CMS adaptor generator is now running on port", port);