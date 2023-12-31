import { Container } from 'inversify';
import { RestApplication } from './rest.application.js';
import { Component } from '../shared/types/index.js';
import { ILogger, PinoLogger } from '../shared/libs/logger/index.js';
import { IConfig, RestConfig, RestSchema } from '../shared/libs/config/index.js';
import { IDatabaseClient, MongoDatabaseClient } from '../shared/libs/database-client/index.js';
import {
  AppExceptionFilter,
  IExceptionFilter,
  ValidationExceptionFilter,
} from '../shared/libs/rest/index.js';
import { HttpErrorExceptionFilter } from '../shared/libs/rest/exception-filter/http-error.exception-filter.js';
import { PathTransformer } from '../shared/libs/rest/transform/path-transformer.js';

export function createRestApplicationContainer() {
  const contaiter = new Container();

  contaiter.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  contaiter.bind<ILogger>(Component.Logger).to(PinoLogger).inSingletonScope();
  contaiter.bind<IConfig<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
  contaiter
    .bind<IDatabaseClient>(Component.DatabaseClient)
    .to(MongoDatabaseClient)
    .inSingletonScope();
  contaiter
    .bind<IExceptionFilter>(Component.ExceptionFilter)
    .to(AppExceptionFilter)
    .inSingletonScope();
  contaiter
    .bind<IExceptionFilter>(Component.HttpExceptionFilter)
    .to(HttpErrorExceptionFilter)
    .inSingletonScope();
  contaiter
    .bind<IExceptionFilter>(Component.ValidationExceptionFilter)
    .to(ValidationExceptionFilter)
    .inSingletonScope();
  contaiter.bind<PathTransformer>(Component.PathTransformer).to(PathTransformer).inSingletonScope();

  return contaiter;
}
