import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { IExceptionFilter } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { ILogger } from '../../libs/logger/index.js';
import { BaseAuthException } from './exceptions/index.js';

@injectable()
export class AuthExceptionFilter implements IExceptionFilter {
  constructor(@inject(Component.Logger) private readonly logger: ILogger) {
    this.logger.info('Register AuthExceptionFilter');
  }

  public catch(error: unknown, _req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof BaseAuthException)) {
      return next(error);
    }

    this.logger.error(error, `[AuthModule] ${error.message}`);
    res.status(error.httpStatusCode).json({
      type: 'AUTHORIZATION',
      error: error.message,
    });
  }
}
