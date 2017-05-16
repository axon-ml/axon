import {Service} from "./service";
import {HttpCodes} from "../httpcodes";
import {Claim, Token, verify} from "../tokens";

import {Request, Response, Router} from "express";
import * as pg from "pg";

export class StarSevice extends Service {

    private db: pg.Pool;

    constructor(db: pg.Pool) {
        super();
        this.db = db;
    }

    protected setupRoutes(): Router {
        return Router()
            .post("/:id", (req, res) => this.handleStar(req, res));
    }

    // Add a star for the given model from the logged-In user.
    private handleStar(req: Request, res: Response) {
        // If the Bearer token was attached, then verify it, extract the user and place for that user.
        const header = req.header("authorization");
        if (!header || !header.startsWith("Bearer ")) {
            return res.status(HttpCodes.FORBIDDEN).send("Must attach Authorization: Bearer XXX with token!");
        }

        try {
            const tokenStr = atob(header.substring(7));
            const token = JSON.parse(tokenStr) as Token;
            // check signature
            // TODO: check the issue date to see if the token is outdated!

            if (!verify(token)) {
                return res.status(HttpCodes.FORBIDDEN).send("Failed to verify token");
            }
            // If we succeed, check the claim, find the userID, place a new row for this user.
            const query = `
            INSERT INTO stars
            (userid, modelid)
            VALUES ($1, $2);
            `;
            this.db.query(query, [token.claim.userId, parseInt(req.params.id)], (err, result) => {
                if (err) {
                    return res.status(HttpCodes.INTERNAL_SERVER_ERROR).send(err);
                }

                // Send the all-clear in the good case.
                res.send(HttpCodes.OK);
            });
        } catch (err) {
            return res.status(HttpCodes.BAD_REQUEST).send(err);
        }

    }
}
