import {HttpCodes} from "../httpcodes";
import {contentType} from "../middleware";
import {Service} from "./service";
import {createLogger} from "../logger";

import {Request, Response, Router} from "express";
import * as pg from "pg";

const LOGGER = createLogger("DataService");

/**
 * DataService is a facade in front of the database. We'll want to add routes for things like
 * accessing the number of stars for a particular user, etc.
 */
export class DataService extends Service {
    private db: pg.Pool;

    constructor(db: pg.Pool) {
        super();
        this.db = db;
    }

    protected setupRoutes(): Router {
        return Router()
            .get("/models/:username", (req, res) => this.handleModels(req, res))
            .get("/id/:username", (req, res) => this.handleReverseLookupUserId(req, res))
            .get("/id/:username/:modelname", (req, res) => this.handleReverseLookupModelId(req, res));
    }

    private handleModels(req: Request, res: Response) {
        const {username} = req.params;
        const query = `
        SELECT models.name as name, handle, models.id as id FROM users, models
        WHERE users.handle = $1
          AND users.id = models.owner`;
        this.db.query(query, [username], (err, result) => {
            if (err) {
                LOGGER.error(`Postgres error: ${err}`);
                return res.status(HttpCodes.INTERNAL_SERVER_ERROR).send(err);
            }

            const models = [];
            for (const row of result.rows) {
                models.push(row);
            }
            LOGGER.info(`Models for ${username}: ${JSON.stringify(models)}`);
            return res.json({models: models}).end();
        });
    }

    private handleReverseLookupUserId(req: Request, res: Response) {
        const query = `
        SELECT id
        FROM users
        WHERE handle = $1
        `;
        this.db.query(query, [req.params.username], (err, results) => {
            if (err) {
                LOGGER.error(`Postgres error: ${err}`);
                return res.status(HttpCodes.INTERNAL_SERVER_ERROR).send(err);
            }

            if (results.rowCount === 0) {
                LOGGER.error(`No such user ${req.params.username}`);
                return res.status(HttpCodes.NOT_FOUND).send(`No such user ${req.params.username}`);
            }

            // Return the user id
            return res.json({id: results.rows[0].id});
        });
    }

    private handleReverseLookupModelId(req: Request, res: Response) {
        // Search for the model based on the username and modelname combo
        const query = `
        SELECT models.id as id
        FROM models, users
        WHERE users.handle = $1 AND models.name = $2 AND models.owner = users.id
        `;
        this.db.query(query, [req.params.username, req.params.modelname], (err, results) => {
            if (err) {
                LOGGER.error(`Postgres error: ${err}`);
                return res.status(HttpCodes.INTERNAL_SERVER_ERROR).send(err);
            }

            if (results.rowCount === 0) {
                const error = `No such model ${req.params.username}/${req.params.modelname}`;
                LOGGER.error(error);
                return res.status(HttpCodes.NOT_FOUND).send(error);
            }

            return res.json({id: results.rows[0].id});
        });
    }
}
