import {Request, Response, Router} from "express";
import {contentType} from "../middleware";
import {IService} from "./service";
import * as pg from "pg";
import {createLogger} from "../logger";

const LOGGER = createLogger("DataService");

/**
 * DataService is a facade in front of the database. We'll want to add routes for things like
 * accessing the number of stars for a particular user, etc.
 */
export class DataService implements IService {
    private serviceRouter: Router;
    private configured: boolean;
    private db: pg.Pool;

    constructor(db: pg.Pool) {
        this.serviceRouter = Router();
        this.db = db;
        this.configured = false;
    }

    public router(): Router {
        if (!this.configured) {
            this.setupRoutes();
            this.configured = true;
        }
        return this.serviceRouter;
    }

    private setupRoutes() {
        this.serviceRouter
            .get("/models/:username", (req, res) => this.handleModels(req, res));
    }

    private handleModels(req: Request, res: Response) {
        const {username} = req.params;
        const query = `
        SELECT * FROM users, models
        WHERE users.handle = $1
            AND users.id = models.owner`;
        this.db.query(query, [username], (err, result) => {
            if (err) {
                res.status(500).send(err);
            } else {
                let models = [];
                for (let row of result.rows) {
                    const {name, handle} = row;
                    models.push({name: name, handle: handle});
                }
                LOGGER.info(`Models for ${username}: ${JSON.stringify(models)}`);
                res.json({models: models}).end()
            }
        });
    }
}
