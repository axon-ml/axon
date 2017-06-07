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
            // The first message from a new client will contain the ID of the container they want to attach onto.
            let firstMsg = true;
            LOGGER.info("WS connection");

            client.on("message", msg => {
                // The client should only be sending a single message.
                // Ignore all subsequent messages they send us.
                if (!firstMsg) {
                    return;
                }
                firstMsg = false;

                /* Send chunks of output from the container over to the client. */
                LOGGER.info(`Client attaching to container ${msg}`);
                watchContainer(msg, err => client.close(1011, err),
                    chunk => client.send(chunk, {binary: false},
                                            err => LOGGER.error("Getting very angry, because:" + err)));
                });
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
            .then(containerId => res.send(containerId))
            .catch(err => res.status(HttpCodes.INTERNAL_SERVER_ERROR).send(err));
    }
}
