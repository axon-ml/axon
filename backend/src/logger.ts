import * as winston from "winston";

/**
 * Exports a logger that can be used by all interfaces.
 */
export function createLogger(name: string): winston.LoggerInstance {
    return new winston.Logger({
        transports: [
            new winston.transports.Console({
                colorize: true,
                label: name,
            }),
        ],
    });
}
