import { createLogger, transports, format } from 'winston';

export const logger = createLogger({
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    trace: 4,
    debug: 5,
  },
  level: 'info',
  transports: [new transports.Console()],
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.simple()
  ),
});
