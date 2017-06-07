import {AuthService, CompileService, DataService, StarSevice, TrainService} from "./services";
import {ICodegenBackend, KerasBackend} from "./compiler/codegen";

import {json as jsonBody} from "body-parser";
import * as express from "express";
import {createLogger} from "./logger";
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
    user: "axon",
    password: "axon",
});

// Create compiler backend.
const CODEGEN: ICodegenBackend = new KerasBackend();

// Initialize + Mount services
const dataService = new DataService(DB);
const authService = new AuthService(DB);
const compileService = new CompileService(CODEGEN, DB);
const starService = new StarSevice(DB);
const trainService = new TrainService();

app.use("/auth", authService.router());
app.use("/data", dataService.router());
app.use("/compile", compileService.router());
app.use("/star", starService.router());
app.use("/train", trainService.router());

// Start the application.
const server = app.listen(3000,  () => {
    const host = server.address().address;
    const port = server.address().port;

    // Enable raw string processing
    const raw = String.raw;
    const BANNER = raw`
                                        _
                                       (_)
  __ ___  _____  _ __        __ _ _ __  _
 / _\ \ \/ / _ \| '_ \      / _\ | '_ \| |
| (_| |>  < (_) | | | |    | (_| | |_) | |
 \__,_/_/\_\___/|_| |_|     \__,_| .__/|_|
                                 | |
                                 |_|

    (version 0.0.1)
`;
    console.log(BANNER);
    LOGGER.info("Listening at %s:%d", host, port);
});
