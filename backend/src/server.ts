import {json as jsonBody} from "body-parser";
import * as express from "express";
import {createLogger} from "./logger";
import {AuthService, DataService} from "./services";
import * as winston from "winston";
import * as pg from "pg";
import * as cors from "cors";

const LOGGER: winston.LoggerInstance = createLogger("server");

// Middleware setup.
const app = express();
app.use(jsonBody());
app.use(cors());

app.options("*", cors()); // Enable CORS for all routes with pre-flight requests

// Setup database connection
const DB = new pg.Pool({
    database: "axon",
    host: "localhost",
    port: 5432,
});

// Initialize + Mount services
const dataService = new DataService(DB);
const authService = new AuthService(DB);

app.use("/data", dataService.router());
app.use("/auth", authService.router());

// Start the application.
const server = app.listen(3000,  () => {
    const host = server.address().address;
    const port = server.address().port;
    LOGGER.info("Listening at %s:%d", host, port);
});
