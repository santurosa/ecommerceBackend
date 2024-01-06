import winston from "winston";
import config from "../config/config.js";

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        debug: 'white',
        http: 'green',
        info: 'blue',
        warning: 'yellow',
        error: 'red',
        fatal: 'magenta'
    }
}
const loggingConfig = {
    dev: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelsOptions.colors}),
                winston.format.simple()
            ),
        })
    ],
    prod: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelsOptions.colors}),
                winston.format.simple()
            ),
        }),
        new winston.transports.File({
            filename: 'errors.log',
            level: 'error',
            format: winston.format.simple()
        })
    ]
}

export const addLogger = (req, res, next) => {
    req.logger = winston.createLogger({
        levels: customLevelsOptions.levels,
        transports: loggingConfig[config.environment.ENV]
    })
    req.logger.http(`${req.method} at ${req.url} - ${new Date().toString()} `);
    next();
}

export const logger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: loggingConfig[config.environment.ENV]
})