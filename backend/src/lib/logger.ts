import { env } from '../config/env.js';

type LogLevel = 'info' | 'warn' | 'error';

type LogContext = Record<string, unknown>;

const writeLog = (level: LogLevel, event: string, context: LogContext = {}) => {
  if (env.NODE_ENV === 'test') {
    return;
  }

  const payload = JSON.stringify({
    level,
    event,
    timestamp: new Date().toISOString(),
    ...context,
  });

  if (level === 'error') {
    console.error(payload);
    return;
  }

  if (level === 'warn') {
    console.warn(payload);
    return;
  }

  console.info(payload);
};

export const logInfo = (event: string, context?: LogContext) => {
  writeLog('info', event, context);
};

export const logWarn = (event: string, context?: LogContext) => {
  writeLog('warn', event, context);
};

export const logError = (event: string, context?: LogContext) => {
  writeLog('error', event, context);
};
