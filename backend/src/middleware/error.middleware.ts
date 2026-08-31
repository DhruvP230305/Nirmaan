import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/api-response.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';

  logger.error(`Error processing request to ${req.method} ${req.url}`, err);

  // In production, mask detailed system errors and database stack traces
  const responseMessage =
    env.NODE_ENV === 'production' && status === 500
      ? 'An internal system error occurred.'
      : message;

  res.status(status).json(errorResponse(responseMessage, errorCode));
};
