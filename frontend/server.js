"use strict";

const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
    let url = req.url;
    console.log(req.method.toUpperCase() + "\t" + url);
    if (url.startsWith("/node_modules") || url.startsWith("/static") || url.startsWith("/src") || url.startsWith("/styles")) {
        // Serve from disk.
        fs.readFile(url.substr(1), (err, data) => {
            if (err) {
                console.error("Error: ", err);
                res.writeHead(500);
                res.end(err);
                return;
            }
            res.end(data);
        });
    } else {
        // Serve up index.html, allow the routing to be done on the frontend.
        fs.readFile("index.html", (err, data) => {
            if (err) {
                console.error("Error: ", err);
                res.writeHead(500);
                res.end(err);
                return;
            }
            res.end(data);
        });
    }
});

console.log("Navigate to http://localhost:3001");
server.listen(3001);
