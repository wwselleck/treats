import pino = require("pino");

export const logger = pino({
  prettyPrint: true,
});

export const withLogError = <E>(
  fn: (...args: any[]) => void,
  messageFn: (e: E) => string
) => (...args: any[]) => {
  try {
    return fn(...args);
  } catch (e) {
    logger.error(messageFn(e));
  }
};
