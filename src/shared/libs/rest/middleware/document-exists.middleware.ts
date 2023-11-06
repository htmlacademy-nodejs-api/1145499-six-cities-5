import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { DocumentExists } from '../../../types/index.js';
import { HttpError } from '../errors/index.js';
import { IMiddleware } from './middleware.interface.js';

export class DocumentExistsMiddleware implements IMiddleware {
  constructor(
    private readonly service: DocumentExists,
    private readonly entityName: string,
    private readonly paramName: string,
  ) {}

  public async execute(
    { params, tokenPayload }: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> {
    const documentId = this.paramName === 'token' ? tokenPayload.id : params[this.paramName];
    if (!(await this.service.exists(documentId))) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${this.entityName} with ${documentId} not found.`,
        'DocumentExistsMiddleware',
      );
    }

    next();
  }
}
