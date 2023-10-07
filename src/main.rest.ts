import 'reflect-metadata';
import { Container } from 'inversify';
import { Component } from './shared/types/index.js';
import { RestApplication } from './rest/index.js';
import { createRestApplicationContainer } from './rest/rest.container.js';
import { createUserContainer } from './shared/modules/user/user.container.js';
import { createHousingOfferContainer } from './shared/modules/housing-offer/housing-offer.container.js';

async function bootstrap() {
  const appContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createHousingOfferContainer(),
  );

  const application = appContainer.get<RestApplication>(Component.RestApplication);
  await application.init();
}

bootstrap();
