import _ from 'lodash';
import pino, { Logger, LoggerOptions } from 'pino';
import pinoColada from 'pino-colada';
import PinoHttp from 'pino-http';
import * as configUtils from './config';

type LogPrettifier = 'pino-colada' | 'pino-pretty';
type CreateLoggerArgs = {
    logPrettifier: LogPrettifier | null;
    logger: LoggerOptions;
    httpLogger: PinoHttp.Options;
};

export const defaultLoggerOptions = configUtils.createConfigPart({
    logger: {
        level: configUtils.string('info'),
        prettyPrint: configUtils.boolean(true),
    },
    httpLogger: {
        autoLogging: {
            ignorePaths: configUtils.array(['/metrics', '/admin(.*)']),
        },
    },
    logPrettifier: configUtils.stringOrNull<LogPrettifier>('pino-colada'),
});
const prettyPrintOptions: LoggerOptions['prettyPrint'] = {
    colorize: true,
    levelFirst: true,
    suppressFlushSyncWarning: true,
};

export const makeLogger = (config: CreateLoggerArgs): AppLogger => {
    const loggerOptions: LoggerOptions = {
        ...config.logger,
    };
    if (config.logger.prettyPrint) {
        if (config.logPrettifier === 'pino-colada') {
            loggerOptions.prettifier = pinoColada;
        } else if (config.logPrettifier === 'pino-pretty') {
            _.merge(loggerOptions, prettyPrintOptions);
        }
    }
    const logger = pino(loggerOptions);

    logger.fatal = logger.fatal.bind(logger);
    logger.error = logger.error.bind(logger);
    logger.warn = logger.warn.bind(logger);
    logger.info = logger.info.bind(logger);
    logger.debug = logger.debug.bind(logger);
    const appLogger = new AppLogger(logger);
    setAppLogger(appLogger);
    return appLogger;
};

export const makeHttpLoggerMiddleware = (config: CreateLoggerArgs): PinoHttp.HttpLogger => {
    const { pino: logger } = getAppLogger();
    return PinoHttp({
        logger,
        ...config.httpLogger,
    });
};

export class AppLogger {
    public constructor(public pino: Logger) {}

    public fatal = this.pino.fatal;
    public error = this.pino.error;
    public warn = this.pino.warn;
    public info = this.pino.info;
    public debug = this.pino.debug;
}

let loggerSingleton: AppLogger | null = null;
export function setAppLogger(logger: AppLogger) {
    loggerSingleton = logger;
}
export function getAppLogger() {
    if (!loggerSingleton) {
        throw new Error('AppLogger should be set first');
    }
    return loggerSingleton;
}
