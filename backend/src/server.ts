"use strict";

import * as express from 'express';
import * as session from 'express-session';
import { json as jsonBody } from 'body-parser';

const app = express();

// Setup session and JSON body parser.
app.use(session({secret: 'secretKey', resave: false, saveUninitialized: false}));
app.use(jsonBody());

console.log("dirname:", __dirname);
app.use(express.static(__dirname));

/**
 * Allow user to login.
 */
app.post('/login', (req, res) => {
    console.log('doing things');
    console.log(req.body);
    res.end();
}); 

/**
 * Clear the session
 */
app.post('/logout', function(request, response) {

}); 


const server = app.listen(3000,  () => {
    let port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});


