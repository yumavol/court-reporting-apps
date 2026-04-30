import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '@/lib/errors';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  console.error(err.stack);

  if (err instanceof ValidationError) {
    res.status(err.code).json({ message: err.message, error: err.data });
    return;
  }

  res.status(500).json({ message: err.message });
}
