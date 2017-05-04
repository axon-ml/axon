import { IService } from "./service";
import { Request, Response, Router } from "express";
import { HttpCodes } from "../httpcodes";
import * as pg from "pg";
import * as bcrypt from "bcrypt";
import {createLogger} from "../logger";

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
        this.serviceRouter.post("/login", (req, res) => this.handleLogin(req, res));
        this.serviceRouter.post("/logout", (req, res) => this.handleLogout(req, res));
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
     * Handle a login request.
     */
    private handleLogin(req: Request, res: Response) {
        // Check that we have our form parameters.
        const { username, password } = req.body;
        this.db.query("SELECT * FROM users WHERE handle = $1", [username]).then((result) => {
            LOGGER.info("rowCount=" + result.rowCount);
            if (result.rowCount === 0) {
                // Send an error response, redirect to the start page.
                res.redirect("/login?err");
            } else {
                const { pass_bcrypt } = result.rows[0];
                bcrypt.compare(password, pass_bcrypt).then(passMatch => {
                    LOGGER.info("passMatch=" + passMatch);
                    if (passMatch) {
                        if (req.session === undefined) {
                            res.sendStatus(500);
                            res.end("Must enable req.session");
                        } else {
                            // Set the loggedIn flag for the session.
                            req.session.loggedIn = true;
                            res.redirect("/" + username);
                        }
                    } else {
                        // Password match failed, send back to login page with error message.
                        res.redirect("/login?err");
                    }
                });
            }
        });
    }

    /**
     * Handle logout.
     */
    private handleLogout(req: Request, res: Response) {
        // Clear the cookie from the user, redirect them to the homepage.
        if (req.session !== undefined) {
            // Destroy the session, redirect back to the login page.
            req.session.destroy(() => {
                res.redirect("/login");
            });
        }
    }
}
