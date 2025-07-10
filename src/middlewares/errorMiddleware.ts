import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { TokenExpiredError } from 'jsonwebtoken';

const errorMiddleware = (
  err: any,
  req: any,
  res: any,
  next: any
) => {
  if (err instanceof TokenExpiredError) {
    res.status(401).json({
      message: 'Token has expired. Please log in again.',
    });
    return;
  }

  console.error(err.stack || err.message);
  res.status(500).json({
    message: 'Something went wrong',
  });
  return;
};

export default errorMiddleware;
