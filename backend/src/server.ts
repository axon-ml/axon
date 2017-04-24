import { json as jsonBody } from "body-parser";
import * as express from "express";
import * as session from "express-session";
import { logger } from "./logger";
import { DataService } from "./services/dataservice";

const app = express();

// Middleware setup.
app.use(session({secret: "secretKey", resave: false, saveUninitialized: false}));
app.use(jsonBody());

// Add our services
const dataservice = new DataService();

app.use("/data", dataservice.router());

const server = app.listen(3000,  () => {
    const port = server.address().port;
    logger.info("Listening at http://localhost:" + port + " exporting the directory " + __dirname);
});
