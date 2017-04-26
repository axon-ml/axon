import * as winston from "winston";

/**
 * Create a logger with the given label. The label will be printed out along with
 * the logging level in the console.
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
