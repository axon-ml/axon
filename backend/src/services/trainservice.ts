import {HttpCodes} from "../httpcodes";
import {Service} from "./service";
import {ContainerID, startTraining, watchContainer} from "../training/docker";
import {createLogger} from "../logger";

import {Router, Request, Response} from "express";
import * as ws from "ws";

const LOGGER = createLogger("TrainService");

interface TrainStartRequest {
    code: string;
    dataset: string;
}

export class TrainService extends Service {

    private wsServer: ws.Server;

    constructor() {
        super();

        // Start up the wsServer.
        this.wsServer = new ws.Server({
            port: 3002,
        });
        this.wsServer.on("connection", (client) => {
            // The client should send a single chunk of data with the version they want.
        });
    }

    protected setupRoutes(): Router {
        return Router()
            .post("/start", (req, res) => this.handleStart(req, res));
    }

    /**
     * Kick-off training.
     *
     * req.body should contain a JSON encoding of the TrainStartRequest type.
     */
    private handleStart(req: Request, res: Response) {
        const startRequest = req.body as TrainStartRequest;

        // Kick off training if all is good.
        // Sends back the started Container ID in the response.
        startTraining(startRequest.code, startRequest.dataset)
            .then(containerId => {
                // Setup a websockets server for this container
                const wsServer = new ws.Server({
                    port: 3002,
                    path: `/${containerId}`,
                });
                wsServer.on("connection", client => {
                    LOGGER.info(`WS connection to /${containerId}`);
                    watchContainer(containerId, error => console.log(error), chunk => client.send(chunk));
                });
                LOGGER.info(`Setup websocket server @ /${containerId}`);
                res.send(containerId);
            })
            .catch(err => res.status(HttpCodes.INTERNAL_SERVER_ERROR).send(err));
    }
}
