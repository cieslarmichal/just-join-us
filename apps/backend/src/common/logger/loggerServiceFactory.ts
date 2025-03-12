import { pino } from 'pino';

import { LoggerService } from './loggerService.ts';
import { type LogLevel } from './logLevel.ts';

interface LoggerServiceConfig {
  readonly logLevel: LogLevel;
}

export class LoggerServiceFactory {
  public static create(config: LoggerServiceConfig): LoggerService {
    const { req, res, err } = pino.stdSerializers;

    const logger = pino({
      level: config.logLevel,
      serializers: {
        req,
        res,
        err,
      },
    });

    return new LoggerService(logger);
  }
}
