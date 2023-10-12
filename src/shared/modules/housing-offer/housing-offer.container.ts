import { types } from '@typegoose/typegoose';
import { Container } from 'inversify';
import { Component } from '../../types/index.js';
import { IHousingOfferService } from './housing-offer-service.interface.js';
import { HousingOfferService } from './housing-offer.service.js';
import { HousingOfferEntity, HousingOfferModel } from './housing-offer.entity.js';

export function createHousingOfferContainer() {
  const container = new Container();
  container
    .bind<IHousingOfferService>(Component.HousingOfferService)
    .to(HousingOfferService)
    .inSingletonScope();
  container
    .bind<types.ModelType<HousingOfferEntity>>(Component.HousingOfferModel)
    .toConstantValue(HousingOfferModel);

  return container;
}
