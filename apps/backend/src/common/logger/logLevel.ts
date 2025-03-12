export const logLevels = {
  debug: 'debug',
  info: 'info',
  warn: 'warn',
  error: 'error',
  fatal: 'fatal',
} as const;

export type LogLevel = (typeof logLevels)[keyof typeof logLevels];
