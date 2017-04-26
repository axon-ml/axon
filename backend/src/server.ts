import {json as jsonBody} from "body-parser";
import * as express from "express";
import * as session from "express-session";
import {createLogger} from "./logger";
import {DataService} from "./services";
import * as winston from "winston";

const LOGGER: winston.LoggerInstance = createLogger("server");

// Middleware setup.
const app = express();
app.use(session({secret: "secretKey", resave: false, saveUninitialized: false}));
app.use(jsonBody());

// Add our services: CompilerService, ForkService, StarService, LoginService.
const dataService = new DataService();
app.use("/data", dataService.router());

// Start the application.
const server = app.listen(3000,  () => {
    const host = server.address().address;
    const port = server.address().port;
    LOGGER.info("Listening at %s:%d", host, port);
});
