import { HttpCodes } from "../httpcodes";
import { contentType } from "../middleware";
import { Service } from "./service";
import { createLogger } from "../logger";
import { verify, Token } from "../tokens";
import { btoa } from "../base64";

import { Request, Response, Router } from "express";
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
            .get("/models/:username/:modelname", (req, res) => this.getModel(req, res))
            .get("/models/all", (req, res) => this.getAllModels(req, res))
            .post("/models/save", (req, res) => this.saveModel(req, res))
            .get("/models/:username", (req, res) => this.handleModels(req, res))
            .get("/models/info/:id", (req, res) => this.handleModelInfo(req, res))
            .get("/id/:username", (req, res) => this.handleReverseLookupUserId(req, res))
            .get("/id/:username/:modelname", (req, res) => this.handleReverseLookupModelId(req, res))
            .get("/search/model/:query", (req, res) => this.handleModelSearch(req, res))
            .post("/fork/:id", (req, res) => this.handleFork(req, res));
    }

    private getModel(req: Request, res: Response) {
        const { username, modelname } = req.params;
        const query = `
            select models.markdown as markdown, models.repr as repr from models, users
            where users.handle = $1 and models.name = $2 and models.owner = users.id
        `;
        this.db.query(query, [username, modelname], (err, result) => {
            if (err) {
                LOGGER.error(`Postgres error: ${err}`);
                return res.status(HttpCodes.INTERNAL_SERVER_ERROR).send(err);
            } else {
                return res.status(HttpCodes.OK).send(result);
            }
        });
    }

    private saveModel(req: Request, res: Response) {
        console.log("in save model");
        const { username, modelName, modelJson, markdown } = req.body;
        const updateQuery = `
        update models set markdown = $4, repr = $3
        where name = $1 and owner = (select id from users where handle = $2)`;
        const insertQuery = `insert into models (name, owner, parent, repr, markdown)
           values ($1, (select id from users where handle = $2), NULL, $3, $4)`;
        this.db.query(updateQuery, [modelName, username, modelJson, markdown], (err, result) => {
            if (err) {
                LOGGER.error(`Postgres error: ${err}`);
                return res.status(HttpCodes.INTERNAL_SERVER_ERROR).send(err);
            } else {
                this.db.query(insertQuery, [modelName, username, modelJson, markdown], (err, result) => {
                    return res.status(HttpCodes.OK).send();
                });

            }
        });
    }

    private getAllModels(req: Request, res: Response) {
        const query = `
        select  models.name as modelname,
                users.handle as username,
                users.name as fullname,
                models.parent as parent
        from models, users
        where models.owner = users.id`;
        this.db.query(query, [], (err, result) => {
            if (err) {
                LOGGER.error(err.message);
                return res.status(HttpCodes.INTERNAL_SERVER_ERROR).send(err);
            } else {
                return res.status(HttpCodes.OK).send(result);
            }
        });
    }

    private handleModels(req: Request, res: Response) {
        const { username } = req.params;
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
            return res.json({ models: models }).end();
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
            return res.json({ id: results.rows[0].id });
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

            return res.json({ id: results.rows[0].id });
        });
    }

    private handleModelSearch(req: Request, res: Response) {
        // Fuzzy search for the model based on the username and modelname combo
        const query = `
        SELECT users.handle as handle, models.name as name
        FROM models, users
        WHERE (users.handle LIKE $1 OR models.name LIKE $1) AND models.owner = users.id
        `;
        this.db.query(query, [`%${req.params.query}%`], (err, results) => {
            if (err) {
                LOGGER.error(`Postgres error: ${err}`);
                return res.status(HttpCodes.INTERNAL_SERVER_ERROR).send(err);
            }

            if (results.rowCount === 0) {
                return res.json([]).end();
            }

            return res.json(results.rows.map(row => ({ handle: row.handle, model: row.name }))).end();
        });
    }

    private handleModelInfo(req: Request, res: Response) {
        const query = `
        SELECT id, name, owner, parent
        FROM models
        WHERE models.id = $1`;
        this.db.query(query, [req.params.id]).then(result => {
            // Query here
            if (result.rowCount === 0) {
                return res.status(HttpCodes.NOT_FOUND).send();
            }
            return res.json(JSON.stringify(result.rows[0]));
        }).catch(err => {
            return res.status(HttpCodes.INTERNAL_SERVER_ERROR).send(err);
        });
    }

    private handleFork(req: Request, res: Response) {

        // If the Bearer token was attached, then verify it, extract the user and place for that user.
        const header = req.header("authorization");
        if (!header || !header.startsWith("Bearer ")) {
            return res.status(HttpCodes.FORBIDDEN).send("Must attach Authorization: Bearer XXX with token!");
        }

        try {
            const tokenStr = btoa(header.substring(7));
            const token = JSON.parse(tokenStr) as Token;
            if (!verify(token)) {
                return res.status(HttpCodes.FORBIDDEN).send("Failed to verify token");
            }

            // Grab all information for the model at the current point in time, use for insertion.
            const modelId = req.params.id;
            const query = `
            INSERT INTO models
                (
                    name,
                    owner,
                    markdown,
                    parent,
                    repr
                )
                SELECT
                    name,
                    $1,
                    markdown,
                    CAST($2 as BIGINT),
                    repr
                FROM models
                WHERE models.id = $2
            RETURNING models.id`;
            this.db.query(query, [token.claim.userId, modelId])
                .then(result => res.json(result.rows[0]))
                .catch(err => res.status(HttpCodes.INTERNAL_SERVER_ERROR).send(err));
        } catch (err) {
            LOGGER.error(`${req.path} Received error: ${err}`);
            return res.status(HttpCodes.BAD_REQUEST).send(err);
        }
    }
}
