import {Service} from "./service";
import {Request, Response, Router} from "express";
import {HttpCodes} from "../httpcodes";
import * as pg from "pg";
import * as bcrypt from "bcrypt";
import {createLogger} from "../logger";
import {TOKEN_SECRET} from "../constants";
import {Claim, Token, createToken} from "../tokens";

const LOGGER = createLogger("AuthService");

/**
 * AuthService is a service which Handles authentication for browser clients. Checks passed credentials
 * against bcrypt password hashes stored in the database. Sets a browser cookie with auth token on success.
 */
export class AuthService extends Service {
    private db: pg.Pool;

    constructor(db: pg.Pool) {
        super();
        this.db = db;
    }

    protected setupRoutes(): Router {
        // Add the route for login.
        // Note: because we're using JWT's, credentials are stored purely on the client, which means
        // we don't even need a logout handler, the user will simply start to do things.
        return Router()
            .post("/login", (req, res) => this.handleLogin(req, res));
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
                res.sendStatus(HttpCodes.BAD_REQUEST);
                return;
            } else {
                const {id, pass_bcrypt} = result.rows[0];
                bcrypt.compare(password, pass_bcrypt)
                    .catch(err => res.status(500).end(`bcrypt error: ${err}`))
                    .then(passMatch => {
                        LOGGER.info(`passMatch=${passMatch}`);
                        if (passMatch) {
                            /* Reply with a claim of the user's identity, signed with the secret key. */
                            const claim: Claim = {
                                userId: id as string,
                                iss: new Date(),
                            };
                            const token = JSON.stringify(createToken(claim));
                            res
                                .status(200)
                                .end(token);
                        } else {
                            res.sendStatus(HttpCodes.BAD_REQUEST);
                            return;
                        }
                });
            }
        });
    }
}
