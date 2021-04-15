import pino, { Logger, LoggerOptions } from 'pino';
import { configUtils } from '..';

type CreateLoggerArgs = {
    logger: LoggerOptions;
};

export const defaultLoggerOptions = configUtils.createConfigPart({
    level: configUtils.string('info'),
    prettyPrint: configUtils.boolean(true),
});
const prettyPrint: LoggerOptions['prettyPrint'] = {
    colorize: true,
    levelFirst: true,
    suppressFlushSyncWarning: true,
};

export const makeLogger = (config: CreateLoggerArgs): AppLogger => {
    const logger = pino({ ...config.logger, ...(config.logger.prettyPrint ? prettyPrint : undefined) });

    logger.fatal = logger.fatal.bind(logger);
    logger.error = logger.error.bind(logger);
    logger.warn = logger.warn.bind(logger);
    logger.info = logger.info.bind(logger);
    logger.debug = logger.debug.bind(logger);
    return new AppLogger(logger);
};

export class AppLogger {
    public constructor(public pino: Logger) {}

    public fatal = this.pino.fatal;
    public error = this.pino.error;
    public warn = this.pino.warn;
    public info = this.pino.info;
    public debug = this.pino.debug;
}
