import type { IMiddleware } from "./Store/Store";

interface LoggerMiddlewareParameters {
  logActions?: boolean;
  logState?: boolean;
}

const createLoggerMiddleware = (
  params: LoggerMiddlewareParameters
): IMiddleware<unknown> => (context) => (next) => (action) => {
  const log = [];
  params.logActions && log.push(action);
  params.logState && log.push(context.state);

  console.log("Logger: ", ...log);
  return next(action);
};

export default createLoggerMiddleware;
