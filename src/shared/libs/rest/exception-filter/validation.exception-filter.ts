import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import { Component } from '../../../types/index.js';
import { createErrorObject } from '../../../helpers/index.js';
import { ILogger } from '../../logger/index.js';
import { ValidationError } from '../errors/index.js';
import { ApplicationError } from '../types/application-error.enum.js';
import { IExceptionFilter } from './exception-filter.interface.js';

@injectable()
export class ValidationExceptionFilter implements IExceptionFilter {
  constructor(@inject(Component.Logger) private readonly logger: ILogger) {
    this.logger.info('Register ValidationExceptionFilter');
  }

  public catch(error: unknown, _req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof ValidationError)) {
      return next(error);
    }

    this.logger.error(error, `[ValidationException]: ${error.message}`);

    error.details.forEach((errorField) =>
      this.logger.warn(`[${errorField.property}] — ${errorField.messages}`),
    );

    res
      .status(error.httpStatusCode)
      .json(createErrorObject(ApplicationError.ValidationError, error.message, error.details));
  }
}
