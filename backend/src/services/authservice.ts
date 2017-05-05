import {IService} from "./service";
import {Request, Response, Router} from "express";
import {HttpCodes} from "../httpcodes";
import * as pg from "pg";
import * as bcrypt from "bcrypt";
import {createLogger} from "../logger";
import {FRONTEND_BASE_URL, JWT_SECRET, JWT_SIGN_OPTIONS} from "../constants";
// import * as expressJwt from "express-jwt";
import * as jwt from "jsonwebtoken";

const LOGGER = createLogger("AuthService");

/**
 * AuthService is a service which Handles authentication for browser clients. Checks passed credentials
 * against bcrypt password hashes stored in the database. Sets a browser cookie with auth token on success.
 */
export class AuthService implements IService {
    private serviceRouter: Router;
    private configured: boolean;
    private db: pg.Pool;

    constructor(db: pg.Pool) {
        this.serviceRouter = Router();
        this.configured = false;
        this.db = db;
    }

    private setupRoutes() {
        // Add the route for login.
        // Note: because we're using JWT's, credentials are stored purely on the client, which means
        // we don't even need a logout handler, the user will simply start to do things.
        this.serviceRouter
            .post("/login", (req, res) => this.handleLogin(req, res));
    }

    /**
     * router method returns the service router to be mounted by the application.
     * Must be implemented as part of the IService contract.
     */
    router(): Router {
        if (!this.configured) {
            this.setupRoutes();
            this.configured = true;
        }
        return this.serviceRouter;
    }

    /**
     * Handle a login request. Sends back a signed JWT token if login is successful, otherwise
     * replies with an error message.
     */
    private handleLogin(req: Request, res: Response) {
        // Check that we have our form parameters.
        const {username, password} = req.body;
        LOGGER.info(`Login request user=${username}`);
        this.db.query("SELECT * FROM users WHERE handle = $1", [username]).then((result) => {
            LOGGER.info(`rowCount=${result.rowCount}`);
            if (result.rowCount === 0) {
                // TODO: Unknown username, send back error response.
                res.sendStatus(HttpCodes.BAD_REQUEST)
                return;
            } else {
                const {id, pass_bcrypt} = result.rows[0];
                bcrypt.compare(password, pass_bcrypt)
                    .catch(err => res.status(500).end(`bcrypt error: ${err}`))
                    .then(passMatch => {
                    LOGGER.info(`passMatch=${passMatch}`);
                    if (passMatch) {
                        /* Reply with a claim of the user's identity, signed with the secret key.
                           In the future, we receive this signed claim from the user, decrypt it
                           and use it like a passport: we trust the token and allow the holder to
                           execute actions on behalf of the referenced user. */
                        const claim = {
                            userId: id,
                        };
                        LOGGER.info(`claim: ${JSON.stringify(claim)}`);
                        jwt.sign(claim, JWT_SECRET, JWT_SIGN_OPTIONS, (err, encoded) => {
                            if (err) {
                                // Send an error response back.
                                LOGGER.error(`JWT failed: ${err}`);
                                res
                                    .status(HttpCodes.INTERNAL_SERVER_ERROR)
                                    .end(`JWT failed: ${err}`);
                                return;
                            } else {
                                res
                                    .status(200)
                                    .end(encoded);
                            }
                        });
                    } else {
                        res.sendStatus(HttpCodes.BAD_REQUEST);
                        return;
                    }
                });
            }
        });
    }
}
