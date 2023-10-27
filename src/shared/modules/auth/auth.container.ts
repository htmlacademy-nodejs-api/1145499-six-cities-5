import { Container } from 'inversify';
import { IAuthService } from './auth-service.interface.js';
import { Component } from '../../types/index.js';
import { AuthService } from './auth.service.js';
import { IExceptionFilter } from '../../libs/rest/index.js';
import { AuthExceptionFilter } from './auth.exception-filter.js';

export function createAuthContainer() {
  const container = new Container();
  container.bind<IAuthService>(Component.AuthService).to(AuthService).inSingletonScope();
  container
    .bind<IExceptionFilter>(Component.AuthExceptionFilter)
    .to(AuthExceptionFilter)
    .inSingletonScope();

  return container;
}
