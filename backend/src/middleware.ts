import { RequestHandler } from "express";
import { HttpCodes } from "./httpcodes";
import { logger } from "./logger";

/**
 * Content-Type filtering middleware.
 */
export function contentType(type: string): RequestHandler {
    return (req, res, next) => {
        if (req.header("Content-Type") !== type) {
            res.status(HttpCodes.UNSUPPORTED_MEDIA);
            return next("Expected Content-Type: " + type);
        }
        return next();
    };
}
